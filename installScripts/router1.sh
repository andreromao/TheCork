#!/bin/bash

# Change firewall and netplan files
sudo cp -f routerScriptFiles/00-installer-config.yaml /etc/netplan/00-installer-config.yaml
sudo cp -f routerScriptFiles/before.rules /etc/ufw/before.rules
sudo cp -f routerScriptFiles/defufw /etc/default/ufw
#sudo cp -f routerScriptFiles/user.rules /etc/ufw/user.rules
sudo cp -f routerScriptFiles/sysctl.conf /etc/ufw/sysctl.conf

netplan apply 
ufw enable
