#!/bin/bash

# Change firewall and netplan files
cp -f scriptFiles/00-installer-config.yaml /etc/netplan/00-installer-config.yaml
cp -f scriptFiles/before.rules /etc/ufw/before.rules
cp -f scriptFiles/defufw /etc/default/ufw
cp -f scriptFiles/user.rules /etc/ufw/user.rules
cp -f scriptFiles/sysctl.conf /etc/ufw/sysctl.conf

netplan apply 
ufw enable
