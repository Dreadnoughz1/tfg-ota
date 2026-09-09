import argparse
import json
import random
import sys
import time
from datetime import datetime, timezone

import requests

BASE_URL = "http://localhost:3000"
INGEST_ENDPOINT = f"{BASE_URL}/ingest/attributes"

ATTRIBUTE_OPTIONS = [
    "temperature",
    "vibration",
    "pressure",
    "humidity",
    "voltage",
]

def random_attribute():
    """Generate a random attribute dict with name, value and timestamp."""
    name = random.choice(ATTRIBUTE_OPTIONS)
    # Generate plausible value ranges per attribute
    if name == "temperature":
        value = round(random.uniform(20.0, 100.0), 2)
    elif name == "vibration":
        value = round(random.uniform(0.0, 10.0), 3)
    elif name == "pressure":
        value = round(random.uniform(0.5, 5.0), 3)
    elif name == "humidity":
        value = round(random.uniform(30.0, 90.0), 2)
    else:  # voltage
        value = round(random.uniform(110.0, 240.0), 1)
    timestamp = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    return {"attributeName": name, "value": value, "timestamp": timestamp}

def build_payload(gateway_id: int, connector_id: int, machine_id: int, attr_count: int = 2):
    attributes = [random_attribute() for _ in range(attr_count)]
    return {
        "gatewayId": gateway_id,
        "connectorId": connector_id,
        "machineId": machine_id,
        "attributes": attributes,
    }

def send_metrics(payload: dict):
    try:
        resp = requests.post(
            INGEST_ENDPOINT,
            headers={"Content-Type": "application/json"},
            data=json.dumps(payload),
            timeout=10,
        )
        if resp.ok:
            print("✅ Sent payload, server response:", resp.json())
        else:
            print(
                f"❌ Error {resp.status_code}: {resp.text}",
                file=sys.stderr,
            )
    except requests.RequestException as e:
        print(f"🚨 Request failed: {e}", file=sys.stderr)

def parse_args():
    parser = argparse.ArgumentParser(description="Simulate a machine sending metric payloads to the TFG‑OTA ingestion service.")
    parser.add_argument("gateway_id", type=int, help="ID of the gateway (must exist in the DB)")
    parser.add_argument("connector_id", type=int, help="ID of the connector (must exist in the DB)")
    parser.add_argument("machine_id", type=int, help="ID of the machine (must exist in the DB)")
    parser.add_argument("--count", type=int, default=1, help="Number of payloads to send (default: 1)")
    parser.add_argument("--attributes", type=int, default=2, help="Number of attributes per payload (default: 2)")
    parser.add_argument("--interval", type=float, default=0.0, help="Seconds to wait between payloads (default: 0)")
    return parser.parse_args()

def main():
    args = parse_args()
    for i in range(args.count):
        payload = build_payload(
            gateway_id=args.gateway_id,
            connector_id=args.connector_id,
            machine_id=args.machine_id,
            attr_count=args.attributes,
        )
        print(f"Sending payload {i + 1}/{args.count}…")
        send_metrics(payload)
        if args.interval and i < args.count - 1:
            time.sleep(args.interval)

if __name__ == "__main__":
    main()
