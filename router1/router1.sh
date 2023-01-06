#!/bin/bash

# Change firewall and netplan files
sudo cp -f scriptFiles/00-installer-config.yaml /etc/netplan/00-installer-config.yaml
sudo cp -f scriptFiles/before.rules /etc/ufw/before.rules
sudo cp -f scriptFiles/defufw /etc/default/ufw
sudo cp -f scriptFiles/user.rules /etc/ufw/user.rules
sudo cp -f scriptFiles/sysctl.conf /etc/ufw/sysctl.conf

netplan apply 
ufw enable
