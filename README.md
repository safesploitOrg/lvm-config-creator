# LVM Config Creator

**LVM Config Creator** is a simple web-based tool designed to help system administrators automate the process of creating Logical Volume Manager (LVM) setups on Linux systems. It generates the necessary shell commands for creating physical volumes (PVs), volume groups (VGs), and logical volumes (LVs), along with the required fstab entries and verification commands for mounting.

This project is aimed at simplifying the LVM configuration process, making it more accessible and faster to deploy in environments that require LVM setups.

## Features

- **Create LVM Commands**: Automatically generate `pvcreate`, `vgcreate`, and `lvcreate` commands.
- **Generate Fstab Entries**: Provide the correct fstab entry for mounting logical volumes.
- **Verification Commands**: Generate commands to verify that the LVM setup is correct and that the logical volume is mounted.
- **Data Migration**: Generate an `rsync` command to migrate data from an existing directory to the new LVM mount.

## Demo

Check out the live version of the project [here](https://github.com/safesploitOrg/lvm-config-creator).

