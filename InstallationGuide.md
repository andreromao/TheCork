# Installation Guide

## Introduction

To reproduce the environment you will need to create 6 vm's, all ubuntu server machines.

As shown in this infrastructure diagram, there are 2 networks, one called TheCork network and the other one called Discount Server Provider network.

For the TheCork network we are going to need 4 vm's (Router1, Frontend Server, Backend Server and Auth Server).
For the Discount Server Provider network we are going to need 2 vm's (Router2 and Backend Server).

![Diagram](https://user-images.githubusercontent.com/75808145/210816907-ff13c49f-0e0a-41b2-a462-28b05dcdb701.png)

## First VM

### Creating the VM
Download Ubuntu Server 22.04.01 ISO image [here](https://ubuntu.com/download/server)

In virtual box, create a new vm, name it "Router1", a linux Ubuntu (64-bit) machine.

Step by step:
 - Give the vm 1024 MB of RAM. 
 - Select option "Create a virtual hard disk now"
 - Choose VDI as hard disk file type
 - Select "Dynamically allocated"
 - Choose your location and hard drive storage size, 10GB should be enough

### Changing some VM settings
After the vm is created, in virtual box, select the new vm and go to settings

On the Display Tab you can lower the video memory to 8 MB. In this tab you can also increase the scale factor to make your vm screen bigger

On the Storage Tab, click under "Controller IDE", where it says "Empty". Next to "Optical Drive", click on the small CD icon to load the Ubuntu Server 22.04.01 ISO image. You can do so by clicking on "Choose a disk file".

On the Network Tab, enable all 4 adapters. Adapters 1, 2 and 3 are Internal Network, give them the following names:
 - Adapter 1 name: subnet1
 - Adapter 2 name: subnet2
 - Adapter 3 name: external

The 4th adaptor is a NAT, which we'll configure later on this guide.

### Starting the VM - TODO

### Installing the needed software
We now want to get this github repo content inside our machine, to do so we are going to do the following commands:

```
Sudo apt update -y
sudo apt-get update
sudo apt-get install git
```

When cloning the repository, we will be asked to paste our auth token. Since a shared Clipboard or a shared folder are hard to setup on Ubuntu server, we will do a workaround and use ssh to paste the token from our own host terminal.

For this we are going to install openssh-server. After installing check if the status is "active".

```
sudo apt install openssh-server
sudo systemctl status ssh
```

To ssh to work, we will need to set a port forwarding on our NAT. Firstly check your NAT's ip address by doing the following command.

```
ip a
```

Then, on Virtual Box settings go to the Network Tab and choose adapter 4, click on advanced. Select "Port Forwarding" and add a rule, like the one shown in the picture. In the "Guest IP", where we have "10.0.5.15", you should past the address of your NAT, which should be similar, if not the same.

<img width="602" alt="sshRule" src="https://user-images.githubusercontent.com/75808145/210790414-ae543806-8e19-4635-aa6e-8f7962597239.png">

You might need to restart your virtual machine for the changes to take effect.

Then, from your host machine run the SSH command in the following format: ssh -p 2222 guest_os_username@127.0.0.1. Where guest_os_username is the name you have to your vm user, when creating it. For example:

```
ssh -p 2222 group25@127.0.0.1
```

After establishing the connection, you can clone this repository and paste your authentication token

```
Git clone https://github.com/andreromao/TheCork.git
```

The rest of the configurations are done by running the script

# TODO



