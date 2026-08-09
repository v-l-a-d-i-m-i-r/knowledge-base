---
title: Wi-Fi to Ethernet Sharing on Arch Linux (with NetworkManager)
tags:
  - networkmanager
  - networking
  - linux
  - wireless
  - iptables
date: 09-08-2026
---

# Wi-Fi to Ethernet Sharing on Arch Linux (with NetworkManager)

## Goal

Share your Arch Linux host's Wi-Fi connection to a client via Ethernet cable, with full internet access on the client. The client can run any OS (Windows, Linux, macOS, etc.) — this guide uses Windows for the client-side example steps.

## Prerequisites

- Arch Linux host with working Wi-Fi
- Client with an Ethernet port (any OS)
- Ethernet cable (patch cord)
- NetworkManager installed and managing Wi-Fi
- `dnsmasq` installed (required by NetworkManager for the shared connection's DHCP/DNS)

## Part 1: Initial Setup (GUI Method)

### Step 1.1: Connect Hardware

Plug the Ethernet cable between the host and the client.

### Step 1.2: Configure Shared Connection

1. Open **Settings** → **Network**, or run `nm-connection-editor` in a terminal
2. Find your wired connection (or create a new Ethernet connection)
3. Go to the **IPv4 Settings** tab
4. Set **Method** to **"Shared to other computers"**
5. Click **Save**

### Step 1.3: Verify on the Client

Example on Windows:

```cmd
ipconfig /all
```

You should see:

- IPv4 Address: `10.42.0.x` (some number)
- Default Gateway: `10.42.0.1`
- DNS Servers: `10.42.0.1`

If you see these, local networking works. If not, manually set a static IP (example for Windows):

- IP: `10.42.0.100`
- Mask: `255.255.255.0`
- Gateway: `10.42.0.1`
- DNS: `8.8.8.8` and `1.1.1.1`

## Part 2: Fixing Internet Access

Even with local connectivity working, internet may not pass through. Follow these steps.

### Step 2.1: Enable IP Forwarding

Check current status:

```bash
sysctl net.ipv4.ip_forward
```

If output is `0`, enable it:

```bash
# Enable immediately
sudo sysctl -w net.ipv4.ip_forward=1

# Make permanent
echo "net.ipv4.ip_forward=1" | sudo tee /etc/sysctl.d/99-ipforward.conf
```

### Step 2.2: Get Your Interface Names

```bash
nmcli device status
```

Note down:

- Wi-Fi interface (`TYPE: wifi`, `STATE: connected`) — example: `wlan0`
- Ethernet interface (`TYPE: ethernet`, `STATE: connected`) — example: `eth0`

### Step 2.3: Add iptables Rules

Replace `wlan0` and `eth0` with your actual interface names from step 2.2.

```bash
# NAT rule (masquerade traffic going out through Wi-Fi)
sudo iptables -t nat -A POSTROUTING -o wlan0 -j MASQUERADE

# Allow forwarding from Ethernet to Wi-Fi
sudo iptables -A FORWARD -i eth0 -o wlan0 -j ACCEPT

# Allow return traffic from Wi-Fi to Ethernet
sudo iptables -A FORWARD -i wlan0 -o eth0 -m state --state RELATED,ESTABLISHED -j ACCEPT
```

### Step 2.4: Verify Rules Exist

Check NAT rules:

```bash
sudo iptables -t nat -L -v -n
```

Look for your MASQUERADE rule with your Wi-Fi interface, e.g.:

```text
Chain POSTROUTING (policy ACCEPT ...)
 pkts bytes target     prot opt in     out     source               destination
    0     0 MASQUERADE  all  --  *      wlan0   0.0.0.0/0            0.0.0.0/0
```

Check FORWARD rules:

```bash
sudo iptables -L FORWARD -v -n
```

### Step 2.5: Test Internet on the Client

Example on Windows (Command Prompt):

```cmd
ping 8.8.8.8
ping google.com
```

- If `8.8.8.8` works but `google.com` doesn't → DNS issue on the client/router side
- If neither works → check for a firewall blocking forwarded traffic (firewalld, ufw, or restrictive iptables rules)

## Part 3: Making Rules Persistent

Rules added with the `iptables` command are lost after reboot. Save them permanently:

### Step 3.1: Save Current Rules

```bash
sudo mkdir -p /etc/iptables
sudo iptables-save -f /etc/iptables/iptables.rules
```

### Step 3.2: Enable iptables Service

```bash
# Install if not present
sudo pacman -S iptables

# Enable and start service
sudo systemctl enable --now iptables.service
```

### Step 3.3: Verify Service

```bash
sudo systemctl status iptables
```

Now rules will be restored automatically on every boot.

## Part 4: Cleanup / Disable Sharing

To stop sharing internet to the client:

```bash
# Delete the shared connection
sudo nmcli connection delete Shared-PC

# Flush custom iptables rules (optional)
sudo iptables -t nat -F POSTROUTING
sudo iptables -F FORWARD

# Disable IP forwarding (optional)
sudo sysctl -w net.ipv4.ip_forward=0
```

Or simply revert your wired connection to normal DHCP in NetworkManager settings.

## Notes

- The shared network uses subnet `10.42.0.0/24` by default
- Host gets `10.42.0.1`, the client gets `10.42.0.x` via DHCP
- This setup coexists with Docker (Docker uses `172.17.0.0/16` and `172.18.0.0/16`)
- For simultaneous Wi-Fi and Ethernet sharing, the host must remain connected to Wi-Fi
