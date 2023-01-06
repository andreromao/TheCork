#!/bin/bash

# Change firewall and netplan files
sudo cp -f router2ScriptFiles/00-installer-config.yaml /etc/netplan/00-installer-config.yaml
sudo cp -f router2ScriptFiles/before.rules /etc/ufw/before.rules
sudo cp -f router2ScriptFiles/defufw /etc/default/ufw
#sudo cp -f routerScriptFiles/user.rules /etc/ufw/user.rules
sudo cp -f router2ScriptFiles/sysctl.conf /etc/ufw/sysctl.conf

netplan apply 
ufw enable
