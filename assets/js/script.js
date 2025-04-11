// Function to open tabs
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Set default tab to "Create"
document.getElementById("createTab").click();

// Function to generate LVM commands for Create tab
function generateLVMCommands(disk, vg, lv, mountPoint) {
    return `
# LVM commands
pvcreate ${disk}
vgcreate ${vg} ${disk}
lvcreate -n ${lv} -l 100%FREE ${vg}
mkfs.xfs /dev/${vg}/${lv}
mkdir -p ${mountPoint}
    `;
}

// Function to generate the fstab entry for Create tab
function generateFSTABEntry(vg, lv, mountPoint) {
    return `
# Fstab entry
/dev/${vg}/${lv} ${mountPoint} xfs nofail,usrquota,grpquota 0 0
    `;
}

// Function to generate verification commands for Create tab
function generateVerificationCommands(mountPoint) {
    return `
# Verify commands
systemctl daemon-reload
mount -a

# Confirm mounts
df -h | grep ${mountPoint}
    `;
}

// Function to generate rsync migration command for Create tab
function generateRsyncCommand(mountPoint) {
    return `
# Data migration using rsync
rsync -av --delete /oldPath/ ${mountPoint}/
    `;
}

// Resize LVM function for Resize tab
function generateResizeCommands(disk, vg, lv) {
    return `
# Resize the Physical Volume
pvresize ${disk}

# Extend the Logical Volume
lvextend -l +100%FREE /dev/${vg}/${lv}
    `;
}

// Event listener for "Create LVM" button
document.getElementById('generate-button').addEventListener('click', function () {
    const disk = document.getElementById('disk').value;
    const vg = document.getElementById('vg').value;
    const lv = document.getElementById('lv').value;
    const mountPoint = document.getElementById('mount-point').value;

    // Generate LVM commands for Create
    const lvmCommands = generateLVMCommands(disk, vg, lv, mountPoint);
    const fstabEntry = generateFSTABEntry(vg, lv, mountPoint);
    const verifyCommands = generateVerificationCommands(mountPoint);
    const rsyncCommand = generateRsyncCommand(mountPoint);

    // Display generated commands
    document.getElementById('commands-output').textContent = lvmCommands;
    document.getElementById('fstab-output').textContent = fstabEntry;
    document.getElementById('verify-output').textContent = verifyCommands;
    document.getElementById('rsync-output').textContent = rsyncCommand;
});

// Event listener for "Resize LVM" button
document.getElementById('resize-button').addEventListener('click', function () {
    const disk = document.getElementById('resize-disk').value;
    const vg = document.getElementById('resize-vg').value;
    const lv = document.getElementById('resize-lv').value;

    // Generate Resize LVM commands
    const resizeCommands = generateResizeCommands(disk, vg, lv);

    // Display generated commands for resizing
    document.getElementById('resize-output').textContent = resizeCommands;
});

// Set Footer Year
function setFooterYear() {
    const year = new Date().getFullYear();
    document.getElementById('year').textContent = year;
}

window.onload = () => {
    setFooterYear();
};
