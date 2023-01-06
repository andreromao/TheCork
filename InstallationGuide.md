# Installation Guide

## 1. Introduction

To reproduce the environment you will need to create 6 VMs, all of them running Ubuntu Server.

As shown in this infrastructure diagram, there are 2 networks, one called "TheCork Network" and the other one called "Discount Server Provider Network".

For the TheCork Network we are going to need 4 VMs (Router1, Frontend Server, Backend Server and Auth Server).
For the Discount Server Provider network we are going to need 2 VMs (Router2 and Backend Server).

![diagram](https://user-images.githubusercontent.com/75808145/211056765-06c7fc52-39d8-4215-947a-31af84332372.png)

## 2. Creating the VMs

### 2.1 "Template" VM
### 2.1.1. Creating the "template" VM
Firstly, download Ubuntu Server 22.04.01 ISO image [here](https://ubuntu.com/download/server)

In VirtualBox, create a new VM, name it "Template", a linux Ubuntu (64-bit) machine.

Step by step:
 - Assign 1024MB of RAM to the VM
 - Select option "Create a virtual hard disk now"
 - Choose VDI as hard disk file type
 - Select "Dynamically allocated"
 - Choose your location and hard drive storage size, 10GB should be enough

### 2.1.2. Changing some VM settings
After the VM is created, in VirtualBox, select the new VM and go to Settings.

On the Display Tab you can lower the video memory to 8 MB if you are using a machine with limited video memory. In this tab, you can also increase the scale factor to make your VM screen bigger.

On the Storage Tab, click under "Controller IDE", where it says "Empty". Next to "Optical Drive", click on the small CD icon to load the Ubuntu Server 22.04.01 ISO image you previously downloaded. You can do so by clicking on "Choose a disk file".

### 2.1.3. Starting the VM
After turning the machine on, select "Try to install ubuntu". After that you will need to go through an 9 step setup wizard.

 - Step 1 - Choose your prefered language
 - Step 2 - Continue without updating
 - Step 3, 4, 5 & 6 - Choose done
 - Step 7 - Create a user
 - Step 8 & 9 - Click done

Then wait for all the setup to take place. (This might take a few minutes)

After that, select "Reboot Now"

When the machine starts, be sure to turn it off and remove the CD device used for the installation.

### 2.1.4. Installing the needed software

To install the needed software, we will use some scripts.

Since the scripts are on this github repository we need to clone the repo inside the VM. To do so, type:

```
git clone https://github.com/andreromao/TheCork.git
```

After cloning the repository, run an initial script called "template.sh".

You can find this script in the installationScripts folder. 

```
sudo chmod +x template.sh
sudo ./template.sh
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

On the Network Tab, enable all 4 adapters. Adapters 1 will be a NAT, the remaining will be internal networks

Give the internal connections these names:
 - Adapter 2 name: subnet1
 - Adapter 3 name: subnet2
 - Adapter 4 name: external

After setting these configurations, you can run the vm.

Now run the Router1 script to finish the configuration

You can find this script in the installationScripts folder. 

```
sudo chmod +x router1.sh
sudo ./router1.sh
```

### 3.2. Frontend Server

Begin by installing the node dependencies, before removing the default NAT gateway of the template machine

```
cd frontend
sudo npm i
```

On the Network Tab, enable one Internal Network adapter named subnet1.

Now run the Frontend script to finish the configuration

You can find this script in the installationScripts folder. 

```
sudo chmod +x frontend.sh
sudo ./frontend.sh
```

### 3.3. Backend Server

Begin by installing the node dependencies, before removing the default NAT gateway of the template machine

```
cd BackendServer
sudo npm i
```

On the Network Tab, enable one Internal Network adapter named subnet3.

Now run the Backend script to finish the configuration

You can find this script in the installationScripts folder. 

```
sudo chmod +x backend.sh
sudo ./backend.sh
```

### 3.4. Auth Server

Begin by installing the node dependencies, before removing the default NAT gateway of the template machine

```
cd authServer
sudo npm i
```

Then on the Network Tab, enable one Internal Network adapter named subnet4.

Now run the Auth Server script to finish the configuration

You can find this script in the installationScripts folder. 

```
sudo chmod +x auth.sh
sudo ./auth.sh
```

### 3.5. Router2
On the Network Tab, enable three Internal Network adapter named subnet2, subnet3 and subnet4.

Now run the Router2 script to finish the configuration

You can find this script in the installationScripts folder. 

```
sudo chmod +x router2.sh
sudo ./router2.sh
```

### 3.6. Discount Backend Server

Begin by installing the node dependencies, before removing the default NAT gateway of the template machine

```
cd discount-service
sudo npm i
```

Then, on the Network Tab, enable one Internal Network adapter named external.

Now run the discount script to finish the configuration

You can find this script in the installationScripts folder. 

```
sudo chmod +x disc.sh
sudo ./disc.sh
```

## 4. Testing the system
In your host browser, go to https://localhost
You should see TheCork web page
