#!/bin/bash

# Change firewall and netplan files
sudo cp -f backendScriptFiles/00-installer-config.yaml /etc/netplan/00-installer-config.yaml
sudo cp -f backendScriptFiles/before.rules /etc/ufw/before.rules
sudo cp -f backendScriptFiles/defufw /etc/default/ufw
#sudo cp -f backendScriptFiles/user.rules /etc/ufw/user.rules
sudo cp -f backendScriptFiles/sysctl.conf /etc/ufw/sysctl.conf

netplan apply 
ufw enable
