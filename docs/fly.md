# Fly.io Commands

## Deploy

```bash
# Deploy the app
fly deploy

# Deploy without using local Docker (builds on Fly's servers)
fly deploy --remote-only
```

## Logs

```bash
# Stream live logs
fly logs

# Print recent logs without streaming
fly logs --no-tail
```

## Secrets

```bash
# List all secrets
fly secrets list

# Set a secret
fly secrets set KEY=value

# Set multiple secrets at once
fly secrets set KEY1=value1 KEY2=value2

# Remove a secret
fly secrets unset KEY
```

## Machines

```bash
# List all machines
fly machines list

# Restart a machine
fly machines restart <machine-id>

# Destroy a machine (force-stops it first)
fly machines destroy <machine-id> --force
```

## Volumes

```bash
# List volumes
fly volumes list

# Create a new volume (1GB, in Toronto)
fly volumes create data --size 1 --region yyz

# Extend a volume
fly volumes extend <volume-id> --size 5
```

## SSH

```bash
# Open an interactive shell inside the running machine
fly ssh console

# Run a one-off command
fly ssh console -C "ls /data"

# Inspect the SQLite database
fly ssh console -C "sqlite3 /data/auth.db .tables"
```

## App Status

```bash
# Show app overview (regions, machines, IPs)
fly status

# Open the app in the browser
fly open

# Show recent activity / release history
fly releases
```

## Scale

```bash
# Show current VM sizing
fly scale show

# Change memory
fly scale memory 512

# Change VM size
fly scale vm shared-cpu-1x
```
