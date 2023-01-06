# Installation Guide

## 1. Introduction

To reproduce the environment you will need to create 6 VMs, all ubuntu server machines.

As shown in this infrastructure diagram, there are 2 networks, one called TheCork network and the other one called Discount Server Provider network.

For the TheCork network we are going to need 4 VMs (Router1, Frontend Server, Backend Server and Auth Server).
For the Discount Server Provider network we are going to need 2 VMs (Router2 and Backend Server).

![Diagram](https://user-images.githubusercontent.com/75808145/210816907-ff13c49f-0e0a-41b2-a462-28b05dcdb701.png)

## 2. Creating the VMs

### 2.1 "Template" VM
### 2.1.1. Creating the "template" VM
Firstly download Ubuntu Server 22.04.01 ISO image [here](https://ubuntu.com/download/server)

In virtual box, create a new vm, name it "Template", a linux Ubuntu (64-bit) machine.

Step by step:
 - Give the VM 1024 MB of RAM
 - Select option "Create a virtual hard disk now"
 - Choose VDI as hard disk file type
 - Select "Dynamically allocated"
 - Choose your location and hard drive storage size, 10GB should be enough

### 2.1.2. Changing some VM settings
After the vm is created, in virtual box, select the new vm and go to settings.

On the Display Tab you can lower the video memory to 8 MB. In this tab you can also increase the scale factor to make your vm screen bigger.

On the Storage Tab, click under "Controller IDE", where it says "Empty". Next to "Optical Drive", click on the small CD icon to load the Ubuntu Server 22.04.01 ISO image you previously downloaded. You can do so by clicking on "Choose a disk file".

### 2.1.3. Starting the VM
After turning the machine on, you will need to go through an 11 step setup.

<img width="647" alt="Screenshot 2023-01-05 at 11 15 08" src="https://user-images.githubusercontent.com/75808145/210902651-45a9dc98-342f-46b1-bac4-f53cc0de012c.png">

# TODO 

Step 1 - Choose your prefered language
Step 2 - Continue without updating
Step 3 - Choose done
Step 2 - Choose your keyboard layout
Step 3 - Choose "Install Ubuntu"
Step 4, 5 & 6 - You can skip these steps, press "Done"
Step 7 - Select "Use an entire disk", confirm your disk choice and press done afterwards
Step 8 - 

### 2.1.4. Installing the needed software
We will start by doing some updates.

```
sudo apt update -y
```

We now want to get this github repository content inside our machine, to do so we need to clone the repo.

```
git clone https://github.com/andreromao/TheCork.git
```

The rest of the configurations are done by running the scripts for each machine. This will be explained in the next steps of the guide.

### 2.2 Creating the rest of the VMs
We will now clone our "template" VM 5 times, changing the clone's names to "Frontend Server", "Backend Server", "Auth Server", "Router2" and "Discount Backend Server". We will use the "template" VM as router1, so change its name to "Router1".

- Click `Clone`
- Select the name you want to give to the new machine
- MAC Adress Policy: Generate new MAC addresses for all network adapters
- Select `Linked Clone`

## 3. Configure the VMs
### 3.1. Router1

#FIXME vao ser 5 interfaces?

On the Network Tab, enable all 4 adapters. Adapters 1, 2 and 3 are Internal Network, give them the following names:
 - Adapter 1 name: subnet1
 - Adapter 2 name: subnet2
 - Adapter 3 name: external

The 4th adaptor is a NAT.

Run the Router1 script

### 3.2. Frontend Server
On the Network Tab, enable one Internal Network adapter named subnet1.

Run the Frontend script

### 3.3. Backend Server
On the Network Tab, enable one Internal Network adapter named subnet2.

Run the Backend script

### 3.4. Auth Server
On the Network Tab, enable one Internal Network adapter named subnet3 (?).

Run the AuthServer script

### 3.5. Router2
On the Network Tab, enable two Internal Network adapter named discSubnet and external.

Run the Router2 script

### 3.6. Discount Backend Server
On the Network Tab, enable one Internal Network adapter named discSubnet.

Run the DiscBackend script

## 4. Testing the system
In your host browser, go to https://localhost
You should see TheCork web page
