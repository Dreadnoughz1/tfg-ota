# How to use simulation script

The script will generate random metrics (temperature, vibration, pressure, etc.), POST each payload to the NestJS ingestion endpoint (http://localhost:3000/ingest/attributes), and print the server response or any error.

## Install the required Python package

```bash
pip install requests
```

## Run the script

```bash
python simulate_machine.py <gateway_id> <connector_id> <machine_id> [--count N] [--attributes M] [--interval S]
```

<gateway_id> – ID of an existing gateway in the DB (e.g. 1).
<connector_id> – ID of an existing connector (e.g. 1).
<machine_id> – ID of an existing machine (e.g. 1).
--count N – how many payloads to send (default = 1).
--attributes M – number of random attributes per payload (default = 2).
--interval S – seconds to wait between payloads (default = 0).

## EXAMPLE

```bash
python .\simulate_machine.py 3 1 4 --count 5 --attributes 2 --interval 5
```

## Attribute details

"temperature": from 20.0 to 100.0
"vibration": from 0.0 to 10.0
"pressure": from 0.5 to 5.0
"humidity": from 30.0 to 90.0
"voltage": from 110.0 to 240.0

You can edit the script to add new attributes and ranges
