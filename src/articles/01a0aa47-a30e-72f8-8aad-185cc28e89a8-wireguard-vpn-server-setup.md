---
title: WireGuard VPN Server Setup
tags:
  - wireguard
  - vpn
  - networking
  - linux
  - iptables
date: 16-09-2026
---

# WireGuard VPN Server Setup

## Goal

Set up a WireGuard VPN server on Linux, connect clients, and generate a QR code and a NetworkManager import file for a client.

## Server Setup

### Step 1: Install WireGuard

```sh
sudo apt update
sudo apt-get install wireguard -y
```

### Step 2: Create a Directory for Keys

```sh
mkdir -p ~/wireguard
cd ~/wireguard
```

### Step 3: Create Server Keys

```sh
umask 077
wg genkey | tee server_private.key | wg pubkey > server_public.key
```

### Step 4: Create Client Keys

```sh
wg genkey | tee ~/wireguard/client_1_private.key | wg pubkey > ~/wireguard/client_1_public.key

# For each extra client, repeat with a new file name
wg genkey | tee ~/wireguard/client_2_private.key | wg pubkey > ~/wireguard/client_2_public.key
```

### Step 5: Find the Network Interface Name

```sh
ip route ls | grep default | grep -Po '(?<=dev )(\S+)'
```

The command shows the name of the network card that has the default route, e.g. `eth0`.

### Step 6: Enable IP Forwarding

On Debian 13 (Trixie), add the setting to a new file:

```sh
sudo vim /etc/sysctl.d/10-forward.conf
```

Add these lines to the file:

```ini
net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
```

Apply the setting:

```sh
sudo sysctl --system
```

### Step 7: Create the Tunnel Interface File

This guide uses `wg0` for the interface name and `eth0` for the network card name. Use your own values from Step 5.

```sh
sudo touch /etc/wireguard/wg0.conf
```

### Step 8: Fill the Server Configuration File

Add this content to `/etc/wireguard/wg0.conf`:

```ini
[Interface]
Address = 10.10.0.1/24, fd42:42:42::1/64
ListenPort = 51820
PrivateKey = <content of ~/wireguard/server_private.key>

PostUp = iptables -A FORWARD -i wg0 -j ACCEPT
PostUp = iptables -A FORWARD -o wg0 -j ACCEPT
PostUp = iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

PreDown = iptables -D FORWARD -i wg0 -j ACCEPT
PreDown = iptables -D FORWARD -o wg0 -j ACCEPT
PreDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Peer 1
[Peer]
PublicKey = <content of ~/wireguard/client_1_public.key>
AllowedIPs = 10.10.0.2/32, fd42:42:42::2/128

# Peer 2
[Peer]
PublicKey = <content of ~/wireguard/client_2_public.key>
AllowedIPs = 10.10.0.3/32, fd42:42:42::3/128
```

Replace `eth0` with your network card name from Step 5.

### Step 9: Create the Client Configuration File

Store the client configuration on the server first. You can use it later to make a QR code or to copy it to the client.

```sh
touch ~/wireguard/wg0-client-1.conf
```

### Step 10: Fill the Client Configuration File

Add this content to `~/wireguard/wg0-client-1.conf`:

```ini
[Interface]
PrivateKey = <content of ~/wireguard/client_1_private.key>
Address = 10.10.0.2/32, fd42:42:42::2/128
DNS = 1.1.1.1, 1.0.0.1, 2606:4700:4700::1111, 2606:4700:4700::1001

[Peer]
PublicKey = <content of ~/wireguard/server_public.key>
Endpoint = <server ipv4>:51820
# To send all traffic through the VPN
AllowedIPs = 0.0.0.0/0, ::/0
# To send only internal traffic through the VPN
AllowedIPs = 10.10.0.0/24, fd42:42:42::/64
PersistentKeepalive = 25
```

Use only one `AllowedIPs` line. Delete the line you do not need.

### Step 11: Start the WireGuard Server

```sh
sudo wg-quick up wg0
```

### Step 12: Enable the Server on Startup

```sh
sudo systemctl enable wg-quick@wg0
```

## Client QR Code

Use a QR code to load the client configuration on a phone.

### Step 1: Install `qrencode`

```sh
sudo apt install qrencode
```

### Step 2: Print the QR Code to the Console

```sh
qrencode -t ANSIUTF8 -r ~/wireguard/wg0-client-1.conf
```

## Add the VPN to NetworkManager

Use this method on a Linux client that runs NetworkManager.

### Step 1: Copy the Client Configuration File

Copy `~/wireguard/wg0-client-1.conf` from the server to `/etc/wireguard/wg0-client.conf` on the client.

### Step 2: Import the Configuration

```sh
sudo nmcli connection import type wireguard file /etc/wireguard/wg0-client.conf
```

## Notes

- Each peer needs a unique key pair and a unique IP address in `AllowedIPs`.
- The server `AllowedIPs` value for a peer sets which source IPs the server accepts from that peer.
- The client `AllowedIPs` value sets which destination addresses send traffic through the tunnel.
