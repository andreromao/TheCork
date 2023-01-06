#!/bin/bash

# Change firewall and netplan files
sudo cp -f authScriptFiles/00-installer-config.yaml /etc/netplan/00-installer-config.yaml
sudo cp -f authScriptFiles/before.rules /etc/ufw/before.rules
sudo cp -f authScriptFiles/defufw /etc/default/ufw
#sudo cp -f authScriptFiles/user.rules /etc/ufw/user.rules
sudo cp -f authScriptFiles/sysctl.conf /etc/ufw/sysctl.conf

netplan apply 
ufw enable
