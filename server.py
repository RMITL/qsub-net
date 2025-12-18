"""
QSUB.NET Server
Serves Astro static build + API endpoints for application submissions
+ Live dashboard with WebSocket for real-time network stats
"""

import asyncio
import base64
import json
import logging
import mimetypes
import os
import re
import subprocess
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

import aiohttp
from dotenv import load_dotenv
from fastapi import FastAPI, Form, Request, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# SparkPost configuration
SPARKPOST_API_KEY = os.getenv("SPARKPOST_KEY", "")
SPARKPOST_API_URL = "https://api.sparkpost.com/api/v1/transmissions"
FROM_EMAIL = "applications@mail.cquant.co"
FROM_NAME = "QUANTA Applications"
NOTIFICATION_EMAILS = ["info@cquant.co"]

# File upload configuration
UPLOAD_DIR = Path("data/applications/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx"}

# Static files directory (Astro build output)
DIST_DIR = Path(__file__).parent / "dist"

app = FastAPI(title="QSUB.NET", version="1.0.0")

# CORS middleware - allow requests from both http and https versions of qsub.net
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://qsub.net",
        "https://qsub.net",
        "http://www.qsub.net",
        "https://www.qsub.net",
        "http://localhost:8089",
        "http://127.0.0.1:8089",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for applications
applications = []
uploaded_files = {}

# Area labels mapping
AREA_LABELS = {
    "protocol": "Protocol Engineering",
    "data": "Data & Infrastructure",
    "quant": "Quantitative Methods",
    "devops": "Systems / DevOps",
    "frontend": "Frontend & Tooling",
    "community": "Community & Ecosystem",
    "other": "Other",
}


def get_areas_labels(areas: list) -> str:
    """Convert area codes to labels."""
    if not areas:
        return "None specified"
    return ", ".join(AREA_LABELS.get(a, a) for a in areas)


async def send_team_notification(data: dict) -> bool:
    """Send notification email to team about new application."""
    if not SPARKPOST_API_KEY:
        logger.warning("SparkPost API key not configured, skipping team notification")
        return False

    areas = data.get('areas', [])
    areas_label = get_areas_labels(areas)

    html_content = f"""
    <html>
    <head>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8f9fb; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }}
            .header {{ background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%); padding: 24px; }}
            .header h1 {{ margin: 0; color: white; font-size: 20px; font-weight: 600; }}
            .header p {{ margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px; }}
            .content {{ padding: 24px; }}
            .field {{ margin-bottom: 16px; }}
            .field-label {{ font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }}
            .field-value {{ font-size: 15px; color: #111827; }}
            .field-value a {{ color: #6366f1; text-decoration: none; }}
            .experience {{ background: #f8f9fb; border-radius: 8px; padding: 12px; font-size: 14px; color: #374151; line-height: 1.6; white-space: pre-wrap; }}
            .badge {{ display: inline-block; background: #eef2ff; color: #4f46e5; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }}
            .footer {{ padding: 16px 24px; background: #f8f9fb; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }}
            .early-stage {{ margin-top: 16px; padding: 12px; background: #fef3c7; border-radius: 8px; font-size: 13px; color: #92400e; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>New Application Received</h1>
                <p>{data.get('name', 'Unknown')} &middot; {areas_label}</p>
            </div>
            <div class="content">
                <div class="field">
                    <div class="field-label">Name</div>
                    <div class="field-value">{data.get('name', 'N/A')}</div>
                </div>
                <div class="field">
                    <div class="field-label">Email</div>
                    <div class="field-value"><a href="mailto:{data.get('email', '')}">{data.get('email', 'N/A')}</a></div>
                </div>
                <div class="field">
                    <div class="field-label">Location / Time Zone</div>
                    <div class="field-value">{data.get('location', 'Not provided')}</div>
                </div>
                {f'''<div class="field">
                    <div class="field-label">Social Handles</div>
                    <div class="field-value">
                        {f"Discord: {data.get('discord')}" if data.get('discord') else ""}
                        {" &middot; " if data.get('discord') and (data.get('twitter') or data.get('telegram')) else ""}
                        {f"X: {data.get('twitter')}" if data.get('twitter') else ""}
                        {" &middot; " if data.get('twitter') and data.get('telegram') else ""}
                        {f"Telegram: {data.get('telegram')}" if data.get('telegram') else ""}
                    </div>
                </div>''' if data.get('discord') or data.get('twitter') or data.get('telegram') else ''}
                <div class="field">
                    <div class="field-label">Areas of Interest</div>
                    <div class="field-value">{''.join(f'<span class="badge" style="margin-right: 6px; margin-bottom: 4px;">{AREA_LABELS.get(a, a)}</span>' for a in areas) if areas else 'None specified'}</div>
                </div>
                {f'''<div class="field">
                    <div class="field-label">Portfolio Link</div>
                    <div class="field-value"><a href="{data.get('portfolio')}" target="_blank">{data.get('portfolio')}</a></div>
                </div>''' if data.get('portfolio') else ''}
                {f'''<div class="field">
                    <div class="field-label">Resume File</div>
                    <div class="field-value">{data.get('resume_file', {}).get('original_name', 'Uploaded')} ({round(data.get('resume_file', {}).get('size', 0) / 1024)}KB)</div>
                </div>''' if data.get('resume_file') else ''}
                <div class="field">
                    <div class="field-label">Relevant Experience</div>
                    <div class="experience">{data.get('experience', 'Not provided')}</div>
                </div>
                {f'''<div class="field">
                    <div class="field-label">How They'd Like to Contribute</div>
                    <div class="experience">{data.get('contribution', '')}</div>
                </div>''' if data.get('contribution') else ''}
                {f'''<div class="early-stage">
                    &#x2714; Confirmed comfortable with early-stage experimental project
                </div>''' if data.get('early_stage') else ''}
            </div>
            <div class="footer">
                Submitted: {data.get('submitted_at', datetime.now().isoformat())}<br>
                Source IP: {data.get('ip', 'Unknown')}
            </div>
        </div>
    </body>
    </html>
    """

    payload = {
        "recipients": [{"address": email} for email in NOTIFICATION_EMAILS],
        "content": {
            "from": {"email": FROM_EMAIL, "name": FROM_NAME},
            "subject": f"[QUANTA] New Application: {data.get('name', 'Unknown')} - {areas_label}",
            "html": html_content,
            "reply_to": data.get('email', FROM_EMAIL),
        },
    }

    # Add attachment if resume file exists
    resume_file = data.get('resume_file')
    if resume_file and resume_file.get('path'):
        try:
            file_path = Path(resume_file['path'])
            if file_path.exists():
                with open(file_path, 'rb') as f:
                    file_content = f.read()

                # Get MIME type
                mime_type, _ = mimetypes.guess_type(resume_file.get('original_name', 'file'))
                if not mime_type:
                    mime_type = 'application/octet-stream'

                # Add attachment to payload
                payload["content"]["attachments"] = [{
                    "name": resume_file.get('original_name', 'resume'),
                    "type": mime_type,
                    "data": base64.b64encode(file_content).decode('utf-8'),
                }]
                logger.info(f"Attached file: {resume_file.get('original_name')} ({len(file_content)} bytes)")
        except Exception as e:
            logger.error(f"Failed to attach resume file: {e}")

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                SPARKPOST_API_URL,
                json=payload,
                headers={
                    "Authorization": SPARKPOST_API_KEY,
                    "Content-Type": "application/json",
                },
            ) as response:
                if response.status == 200:
                    logger.info(f"Team notification sent for application from {data.get('name')}")
                    return True
                else:
                    error = await response.text()
                    logger.error(f"SparkPost error sending team notification: {response.status} - {error}")
                    return False
    except Exception as e:
        logger.error(f"Failed to send team notification: {e}")
        return False


async def send_applicant_confirmation(data: dict) -> bool:
    """Send confirmation email to applicant."""
    if not SPARKPOST_API_KEY:
        logger.warning("SparkPost API key not configured, skipping applicant confirmation")
        return False

    html_content = f"""
    <html>
    <head>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8f9fb; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }}
            .header {{ background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%); padding: 32px 24px; text-align: center; }}
            .logo {{ width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 24px; color: white; margin-bottom: 16px; }}
            .header h1 {{ margin: 0; color: white; font-size: 22px; font-weight: 600; }}
            .content {{ padding: 32px 24px; }}
            .content p {{ font-size: 15px; color: #374151; line-height: 1.7; margin-bottom: 16px; }}
            .content p:last-child {{ margin-bottom: 0; }}
            .highlight {{ background: #f8f9fb; border-radius: 8px; padding: 16px; margin: 20px 0; }}
            .highlight p {{ margin: 0; font-size: 14px; color: #6b7280; }}
            .footer {{ padding: 20px 24px; background: #f8f9fb; border-top: 1px solid #e5e7eb; text-align: center; }}
            .footer p {{ font-size: 13px; color: #6b7280; margin: 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Q</div>
                <h1>Application Received</h1>
            </div>
            <div class="content">
                <p>Hi {data.get('name', '').split()[0] if data.get('name') else 'there'},</p>
                <p>Thank you for your interest in the QUANTA project. We've received your application and wanted to confirm that it's in our queue for review.</p>
                <p>We're a small team and we review every submission personally. If there's a strong fit as the project progresses, we'll reach out to start a conversation.</p>
                <div class="highlight">
                    <p>In the meantime, feel free to follow our progress. We're building something we think is genuinely interesting in the decentralized intelligence space.</p>
                </div>
                <p>Thanks again for taking the time to reach out.</p>
                <p>&mdash; The QUANTA Team</p>
            </div>
            <div class="footer">
                <p>QUANTA</p>
            </div>
        </div>
    </body>
    </html>
    """

    payload = {
        "recipients": [{"address": data.get('email')}],
        "content": {
            "from": {"email": FROM_EMAIL, "name": FROM_NAME},
            "subject": "QUANTA - Application Received",
            "html": html_content,
        },
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                SPARKPOST_API_URL,
                json=payload,
                headers={
                    "Authorization": SPARKPOST_API_KEY,
                    "Content-Type": "application/json",
                },
            ) as response:
                if response.status == 200:
                    logger.info(f"Confirmation email sent to {data.get('email')}")
                    return True
                else:
                    error = await response.text()
                    logger.error(f"SparkPost error sending confirmation: {response.status} - {error}")
                    return False
    except Exception as e:
        logger.error(f"Failed to send confirmation email: {e}")
        return False


# =============================================================================
# DASHBOARD MONITORING
# =============================================================================

# Configuration for Pi cluster nodes
# Localnet: everything runs on rpi5 (subtensor alice/bob, validator, miner)
CLUSTER_NODES = [
    {
        "name": "Localnet Node (rpi5)",
        "hostname": "rpi5",
        "ip": "10.20.0.11",
        "user": "jhirschfeld",
        "role": "full-node",  # Runs subtensor, validator, and miner
    },
]

# Dashboard state
dash_connections: List[WebSocket] = []
dash_cache: Dict = {}
dash_cache_time: Optional[datetime] = None
DASH_CACHE_TTL = 10  # seconds


async def check_node_health(node: dict) -> dict:
    """Check health of a single node via SSH."""
    health = {
        "name": node["name"],
        "hostname": node["hostname"],
        "ip": node["ip"],
        "role": node["role"],
        "is_online": False,
        "cpu_usage": None,
        "memory_usage": None,
        "disk_usage": None,
        "uptime": None,
        "error": None,
    }

    try:
        cmd = f'ssh -o ConnectTimeout=5 -o BatchMode=yes {node["user"]}@{node["hostname"]} "' \
              f'echo ONLINE && ' \
              f'uptime -p && ' \
              f'cat /proc/loadavg && ' \
              f'free -m | grep Mem && ' \
              f'df -h / | tail -1"'

        result = await asyncio.create_subprocess_shell(
            cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await asyncio.wait_for(result.communicate(), timeout=10)
        output = stdout.decode().strip()

        if "ONLINE" in output:
            health["is_online"] = True
            lines = output.split("\n")

            # Parse uptime
            if len(lines) > 1:
                health["uptime"] = lines[1].replace("up ", "")[:15]

            # Parse CPU load (1 min average, 4 cores on Pi 5)
            if len(lines) > 2:
                load = lines[2].split()[0]
                health["cpu_usage"] = min(float(load) * 100 / 4, 100)

            # Parse memory
            if len(lines) > 3:
                mem_parts = lines[3].split()
                if len(mem_parts) >= 3:
                    total = float(mem_parts[1])
                    used = float(mem_parts[2])
                    health["memory_usage"] = (used / total) * 100

            # Parse disk
            if len(lines) > 4:
                disk_parts = lines[4].split()
                if len(disk_parts) >= 5:
                    usage_str = disk_parts[4].replace("%", "")
                    health["disk_usage"] = float(usage_str)

    except asyncio.TimeoutError:
        health["error"] = "Connection timeout"
    except Exception as e:
        health["error"] = str(e)[:50]

    return health


async def check_all_nodes() -> List[dict]:
    """Check health of all configured nodes."""
    tasks = [check_node_health(node) for node in CLUSTER_NODES]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return [r for r in results if isinstance(r, dict)]


async def get_pm2_services() -> Dict[str, dict]:
    """Get PM2 service status."""
    services = {}
    try:
        result = await asyncio.create_subprocess_shell(
            "pm2 jlist",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, _ = await asyncio.wait_for(result.communicate(), timeout=5)
        pm2_list = json.loads(stdout.decode())

        relevant = ["quanta-api", "quanta-agents", "quanta-monitor", "quanta-dashboard", "qsub-net"]
        for proc in pm2_list:
            name = proc.get("name", "")
            if name in relevant:
                services[name] = {
                    "status": "online" if proc.get("pm2_env", {}).get("status") == "online" else "stopped",
                    "cpu": proc.get("monit", {}).get("cpu", 0),
                    "memory": proc.get("monit", {}).get("memory", 0),
                }
    except Exception as e:
        logger.error(f"Failed to get PM2 status: {e}")

    return services


async def get_metagraph_data() -> Dict:
    """Get subnet metagraph data including UIDs and miners."""
    metagraph = {"uids": [], "total": 0}
    try:
        # Use simpler inline Python command with proper escaping
        python_code = "import bittensor as bt; import json; sub = bt.subtensor(network='local'); meta = sub.metagraph(netuid=1); uids = [{'uid': uid, 'hotkey': meta.hotkeys[uid][:16], 'stake': float(meta.S[uid].item()), 'axon_port': meta.axons[uid].port} for uid in range(meta.n.item())]; print(json.dumps({'uids': uids, 'total': meta.n.item()}))"
        cmd = f'''ssh -o ConnectTimeout=5 -o BatchMode=yes jhirschfeld@rpi5 "source ~/quanta-venv/bin/activate && cd ~/quanta && python3 -c \\"{python_code}\\""'''

        result = await asyncio.create_subprocess_shell(
            cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await asyncio.wait_for(result.communicate(), timeout=15)
        output = stdout.decode().strip()

        # Find the JSON in the output (skip any warnings)
        for line in output.split('\n'):
            if line.strip().startswith('{'):
                metagraph = json.loads(line.strip())
                break
    except asyncio.TimeoutError:
        logger.warning("Metagraph query timed out")
    except Exception as e:
        logger.error(f"Failed to get metagraph: {e}")
    return metagraph


async def get_strategy_leaderboard() -> List[Dict]:
    """Get the latest strategy competition results from signal pool miner log."""
    strategies = []
    try:
        cmd = '''ssh -o ConnectTimeout=5 -o BatchMode=yes jhirschfeld@rpi5 "tail -100 ~/signal_pool_miner.log 2>/dev/null | grep -E 'signal_pool.*QUANTA=' | tail -9"'''
        result = await asyncio.create_subprocess_shell(
            cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, _ = await asyncio.wait_for(result.communicate(), timeout=10)
        lines = stdout.decode().strip().split('\n')

        for line in lines:
            # Parse: strategy_name: QUANTA=1.0674, Sharpe=0.7475, Return=1.58%
            match = re.search(r'(\w+): QUANTA=([-\d.]+), Sharpe=([-\d.]+), Return=([-\d.]+)%', line)
            if match:
                name = match.group(1)
                quanta = float(match.group(2))
                sharpe = float(match.group(3))
                ret = float(match.group(4))
                # Estimate drawdown from sharpe (simplified approximation)
                drawdown = max(0, min(abs(ret * 0.5) if sharpe < 0 else abs(ret * 0.2), 15))
                strategies.append({
                    "name": name,
                    "quanta_score": round(quanta, 4),
                    "sharpe": round(sharpe, 4),
                    "return_pct": round(ret, 2),
                    "drawdown_pct": round(drawdown, 2),
                })

        # Sort by QUANTA score descending
        strategies.sort(key=lambda x: x["quanta_score"], reverse=True)

        # Add rank and tier
        for i, s in enumerate(strategies):
            s["rank"] = i + 1
            if s["quanta_score"] >= 2.0:
                s["tier"] = "elite"
            elif s["quanta_score"] >= 1.0:
                s["tier"] = "profitable"
            elif s["quanta_score"] >= 0:
                s["tier"] = "neutral"
            else:
                s["tier"] = "underperforming"

    except Exception as e:
        logger.error(f"Failed to get strategy leaderboard: {e}")
    return strategies


async def get_winning_strategy() -> Optional[Dict]:
    """Get the current epoch's winning strategy."""
    try:
        cmd = '''ssh -o ConnectTimeout=5 -o BatchMode=yes jhirschfeld@rpi5 "tail -50 ~/signal_pool_miner.log 2>/dev/null | grep -E 'Signal pool winner:' | tail -1"'''
        result = await asyncio.create_subprocess_shell(
            cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, _ = await asyncio.wait_for(result.communicate(), timeout=10)
        line = stdout.decode().strip()

        match = re.search(r'Signal pool winner: (\w+)', line)
        if match:
            return {"name": match.group(1)}
    except Exception as e:
        logger.error(f"Failed to get winning strategy: {e}")
    return None


async def get_subnet_info() -> Dict:
    """Get subnet treasury and alpha information."""
    subnet_info = {
        "tao_pool": 10.0,
        "alpha_pool": 10.0,
        "rate": 1.0,
        "emission": 0.0,
        "tempo": 0,
        "registration_cost": 0.0005,
    }
    try:
        # Query subnet info via btcli
        python_code = "import bittensor as bt; import json; sub = bt.subtensor(network='local'); info = sub.get_subnet_info(netuid=1); print(json.dumps({'tao_pool': float(info.tao_in) if hasattr(info, 'tao_in') else 10.0, 'alpha_pool': float(info.alpha_in) if hasattr(info, 'alpha_in') else 10.0, 'emission': float(info.emission_value) if hasattr(info, 'emission_value') else 0.0, 'tempo': int(info.tempo) if hasattr(info, 'tempo') else 100}))"
        cmd = f'''ssh -o ConnectTimeout=5 -o BatchMode=yes jhirschfeld@rpi5 "source ~/quanta-venv/bin/activate && python3 -c \\"{python_code}\\"" 2>/dev/null'''

        result = await asyncio.create_subprocess_shell(
            cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, _ = await asyncio.wait_for(result.communicate(), timeout=15)
        output = stdout.decode().strip()

        for line in output.split('\n'):
            if line.strip().startswith('{'):
                data = json.loads(line.strip())
                subnet_info.update(data)
                break
    except Exception as e:
        logger.error(f"Failed to get subnet info: {e}")
    return subnet_info


async def gather_dash_status() -> dict:
    """Gather all dashboard status data."""
    global dash_cache, dash_cache_time

    # Check cache
    if dash_cache_time and (datetime.now() - dash_cache_time).seconds < DASH_CACHE_TTL:
        return dash_cache

    # Gather all data in parallel
    nodes_task = check_all_nodes()
    services_task = get_pm2_services()
    metagraph_task = get_metagraph_data()
    strategies_task = get_strategy_leaderboard()
    winner_task = get_winning_strategy()
    subnet_task = get_subnet_info()

    nodes, services, metagraph, strategies, winner, subnet_info = await asyncio.gather(
        nodes_task, services_task, metagraph_task, strategies_task, winner_task, subnet_task
    )

    # Calculate epoch progress (mock for now - replace with actual btcli query)
    now = datetime.now()
    epoch_seconds = 360  # 6 minute epochs
    progress = ((now.minute % 6) * 60 + now.second) / epoch_seconds * 100
    remaining_seconds = epoch_seconds - ((now.minute % 6) * 60 + now.second)
    remaining_min = remaining_seconds // 60
    remaining_sec = remaining_seconds % 60

    # Count miners vs validators from metagraph
    miners_count = sum(1 for u in metagraph.get("uids", []) if u.get("axon_port", 0) > 0)
    validators_count = sum(1 for u in metagraph.get("uids", []) if u.get("stake", 0) > 0)

    status = {
        "nodes": nodes,
        "services": services,
        "network": "local",
        "netuid": 1,
        "epoch": (now.hour * 10) + (now.minute // 6),  # Mock epoch number
        "epoch_progress": round(progress, 1),
        "epoch_remaining": f"~{remaining_min}m {remaining_sec}s",
        "signals_count": len(strategies),
        "treasury": {
            "tao_pool": subnet_info.get("tao_pool", 10.0),
            "alpha_pool": subnet_info.get("alpha_pool", 10.0),
            "rate": subnet_info.get("rate", 1.0),
            "emission": subnet_info.get("emission", 0.0),
            "registration_cost": subnet_info.get("registration_cost", 0.0005),
        },
        "subnet": {
            "registered": True,
            "validators_count": max(validators_count, 1),
            "miners_count": max(miners_count, 1),
            "total_uids": metagraph.get("total", 0),
        },
        "metagraph": metagraph,
        "strategies": strategies,
        "winner": winner,
        "pool": {
            "pending_commits": 0,
            "pending_reveals": 0,
            "scored_today": len(strategies),
            "unique_tickers": 8 if strategies else 0,  # Approximate from winning strategy positions
        },
        "activity": [
            {"type": "score", "title": f"Winner: {winner['name']}" if winner else "Competing", "meta": f"{len(strategies)} strategies evaluated", "time": "Just now"} if strategies else
            {"type": "commit", "title": "Node Online", "meta": "rpi5 localnet node connected", "time": "Just now"},
        ],
        "timestamp": now.isoformat(),
    }

    dash_cache = status
    dash_cache_time = datetime.now()

    return status


# Dashboard API endpoints

@app.get("/api/dash/status")
async def get_dash_status():
    """Get dashboard status via REST."""
    return await gather_dash_status()


@app.websocket("/ws/dash")
async def dash_websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time dashboard updates."""
    await websocket.accept()
    dash_connections.append(websocket)
    logger.info(f"Dashboard WebSocket connected. Total: {len(dash_connections)}")

    try:
        # Send initial status
        status = await gather_dash_status()
        await websocket.send_json(status)

        while True:
            data = await websocket.receive_json()
            if data.get("type") == "refresh":
                status = await gather_dash_status()
                await websocket.send_json(status)

    except WebSocketDisconnect:
        if websocket in dash_connections:
            dash_connections.remove(websocket)
        logger.info(f"Dashboard WebSocket disconnected. Total: {len(dash_connections)}")
    except Exception as e:
        logger.error(f"Dashboard WebSocket error: {e}")
        if websocket in dash_connections:
            dash_connections.remove(websocket)


# =============================================================================
# APPLICATION API Endpoints
# =============================================================================

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Handle resume file uploads."""
    try:
        # Validate file extension
        ext = Path(file.filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            return JSONResponse(
                status_code=400,
                content={"error": f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"}
            )

        # Read file content
        content = await file.read()

        # Validate file size
        if len(content) > MAX_FILE_SIZE:
            return JSONResponse(
                status_code=400,
                content={"error": "File size exceeds 10MB limit"}
            )

        # Generate unique file ID
        file_id = str(uuid.uuid4())
        safe_filename = f"{file_id}{ext}"
        file_path = UPLOAD_DIR / safe_filename

        # Save file
        with open(file_path, "wb") as f:
            f.write(content)

        # Store file info
        uploaded_files[file_id] = {
            "original_name": file.filename,
            "saved_name": safe_filename,
            "path": str(file_path),
            "size": len(content),
            "uploaded_at": datetime.now().isoformat(),
        }

        logger.info(f"File uploaded: {file.filename} -> {safe_filename}")

        return JSONResponse(
            status_code=200,
            content={"file_id": file_id, "filename": file.filename}
        )

    except Exception as e:
        logger.error(f"File upload error: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to upload file"}
        )


@app.post("/api/apply")
async def submit_application(request: Request):
    """Handle application submissions."""
    try:
        data = await request.json()

        # Validate required fields
        required_fields = ['name', 'email', 'experience']
        for field in required_fields:
            if not data.get(field):
                return JSONResponse(
                    status_code=400,
                    content={"error": f"Missing required field: {field}"}
                )

        # Validate areas (at least one must be selected)
        areas = data.get('areas', [])
        if not areas or len(areas) == 0:
            return JSONResponse(
                status_code=400,
                content={"error": "Please select at least one area of interest"}
            )

        # Require either portfolio link OR resume file
        if not data.get('portfolio') and not data.get('resume_file_id'):
            return JSONResponse(
                status_code=400,
                content={"error": "Please provide either a portfolio link or upload a resume"}
            )

        # Add file info if resume was uploaded
        if data.get('resume_file_id'):
            file_info = uploaded_files.get(data['resume_file_id'])
            if file_info:
                data['resume_file'] = file_info

        # Add metadata
        data['submitted_at'] = datetime.now().isoformat()
        data['ip'] = request.client.host if request.client else 'unknown'

        # Store application
        applications.append(data)

        logger.info(f"New application received from {data['name']} ({data['email']}) - Areas: {', '.join(data.get('areas', []))}")

        # Send email notifications
        await send_team_notification(data)
        await send_applicant_confirmation(data)

        return JSONResponse(
            status_code=200,
            content={"status": "success", "message": "Application received"}
        )

    except Exception as e:
        logger.error(f"Error processing application: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error"}
        )


@app.get("/api/applications")
async def list_applications():
    """List all applications (admin endpoint)."""
    return JSONResponse(content={"applications": applications, "count": len(applications)})


@app.post("/api/contact")
async def handle_contact(request: Request):
    """Handle contact form submissions from pitch deck."""
    try:
        data = await request.json()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        subject = data.get('subject', 'General Inquiry').strip()
        message = data.get('message', '').strip()

        if not name or not email or not message:
            return JSONResponse(
                status_code=400,
                content={"error": "Name, email, and message are required"}
            )

        # Send email notification
        success = await send_contact_notification({
            'name': name,
            'email': email,
            'subject': subject,
            'message': message
        })

        if success:
            logger.info(f"Contact form submitted: {name} <{email}> - {subject}")
            return JSONResponse(content={"success": True, "message": "Message sent successfully"})
        else:
            return JSONResponse(
                status_code=500,
                content={"error": "Failed to send message"}
            )

    except Exception as e:
        logger.error(f"Contact form error: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error"}
        )


async def send_contact_notification(data: dict) -> bool:
    """Send contact form notification email to team."""
    if not SPARKPOST_API_KEY:
        logger.warning("SparkPost API key not configured, skipping contact notification")
        return False

    html_content = f"""
    <html>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); padding: 20px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #0d0d14; margin: 0; font-size: 24px;">New Contact Inquiry</h1>
            <p style="color: #0d0d14; margin: 5px 0 0 0; opacity: 0.8;">{data['subject']}</p>
        </div>
        <div style="background: #ffffff; padding: 25px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600; color: #333; width: 100px;">From:</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #555;">{data['name']}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600; color: #333;">Email:</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #555;"><a href="mailto:{data['email']}" style="color: #d4af37;">{data['email']}</a></td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600; color: #333;">Subject:</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #555;">{data['subject']}</td>
                </tr>
            </table>
            <div style="margin-top: 20px;">
                <h3 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">Message:</h3>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; color: #555; line-height: 1.6; white-space: pre-wrap;">{data['message']}</div>
            </div>
        </div>
        <p style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
            Sent from QUANTA Pitch Deck - qsub.net
        </p>
    </body>
    </html>
    """

    payload = {
        "recipients": [{"address": email} for email in NOTIFICATION_EMAILS],
        "content": {
            "from": {"email": FROM_EMAIL, "name": "QUANTA Contact"},
            "subject": f"[QUANTA Contact] {data['subject']} - {data['name']}",
            "html": html_content,
            "reply_to": data['email']
        }
    }

    headers = {
        "Authorization": SPARKPOST_API_KEY,
        "Content-Type": "application/json"
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(SPARKPOST_API_URL, json=payload, headers=headers) as response:
                if response.status == 200:
                    logger.info(f"Contact notification sent for: {data['email']}")
                    return True
                else:
                    error_text = await response.text()
                    logger.error(f"SparkPost error: {response.status} - {error_text}")
                    return False
    except Exception as e:
        logger.error(f"Failed to send contact notification: {e}")
        return False


# Static file serving - must come after API routes
# Serve _astro assets
if (DIST_DIR / "_astro").exists():
    app.mount("/_astro", StaticFiles(directory=str(DIST_DIR / "_astro")), name="astro_assets")


@app.get("/docs/tech-spec")
async def serve_tech_spec_redirect():
    """Redirect tech-spec to the PDF file."""
    file_path = Path(__file__).parent / "public" / "docs" / "QUANTA_Technical_Specification_v4.pdf"
    if file_path.exists():
        return FileResponse(file_path, media_type="application/pdf")
    return JSONResponse(status_code=404, content={"error": "Technical specification not found"})


@app.get("/docs/{path:path}")
async def serve_docs(path: str):
    """Serve documents like PDF specs."""
    # First try dist/docs, then public/docs
    file_path = DIST_DIR / "docs" / path
    if not file_path.exists():
        file_path = Path(__file__).parent / "public" / "docs" / path

    if file_path.exists() and file_path.is_file():
        # Determine media type
        suffix = file_path.suffix.lower()
        media_types = {
            ".pdf": "application/pdf",
            ".doc": "application/msword",
            ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        }
        media_type = media_types.get(suffix, "application/octet-stream")
        return FileResponse(file_path, media_type=media_type)
    return JSONResponse(status_code=404, content={"error": "Document not found"})


@app.get("/litepaper")
async def serve_litepaper():
    """Serve interactive litepaper page."""
    litepaper_file = DIST_DIR / "litepaper" / "index.html"
    if litepaper_file.exists():
        return FileResponse(litepaper_file, media_type="text/html")
    return JSONResponse(status_code=404, content={"error": "Litepaper page not found"})


@app.get("/pitch/{path:path}")
async def serve_pitch_subpath(path: str):
    """Serve pitch page for any subpath."""
    pitch_file = DIST_DIR / "pitch" / "index.html"
    if pitch_file.exists():
        return FileResponse(pitch_file, media_type="text/html")
    return JSONResponse(status_code=404, content={"error": "Not found"})


@app.get("/pitch")
async def serve_pitch():
    """Serve pitch deck page."""
    pitch_file = DIST_DIR / "pitch" / "index.html"
    if pitch_file.exists():
        return FileResponse(pitch_file, media_type="text/html")
    return JSONResponse(status_code=404, content={"error": "Pitch page not found"})


@app.get("/{path:path}")
async def serve_static(path: str):
    """Serve static files from Astro build."""
    # Handle root path
    if not path or path == "/":
        index_file = DIST_DIR / "index.html"
        if index_file.exists():
            return FileResponse(index_file, media_type="text/html")

    # Try exact path
    file_path = DIST_DIR / path
    if file_path.exists() and file_path.is_file():
        return FileResponse(file_path)

    # Try with .html extension
    html_path = DIST_DIR / f"{path}.html"
    if html_path.exists():
        return FileResponse(html_path, media_type="text/html")

    # Try as directory with index.html
    index_path = DIST_DIR / path / "index.html"
    if index_path.exists():
        return FileResponse(index_path, media_type="text/html")

    # 404
    return JSONResponse(status_code=404, content={"error": "Not found"})


@app.get("/")
async def serve_index():
    """Serve the join page (homepage)."""
    index_file = DIST_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file, media_type="text/html")
    return JSONResponse(status_code=404, content={"error": "Index not found"})


def run():
    """Run the server."""
    uvicorn.run("server:app", host="0.0.0.0", port=8089, log_level="info")


if __name__ == "__main__":
    run()
