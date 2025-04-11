// Function to generate LVM commands
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

// Function to generate the fstab entry
function generateFSTABEntry(vg, lv, mountPoint) {
    return `
# Fstab entry
/dev/${vg}/${lv} ${mountPoint} xfs nofail,usrquota,grpquota 0 0
    `;
}

// Function to generate verification commands
function generateVerificationCommands(mountPoint) {
    return `
# Verify commands
systemctl daemon-reload
mount -a

# Confirm mounts
df -h | grep ${mountPoint}
    `;
}

// Function to generate rsync migration command
function generateRsyncCommand(mountPoint) {
    return `
# Data migration using rsync
rsync -av --delete /oldPath/ ${mountPoint}/
    `;
}

// Function to dynamically set the current year in the footer
function setFooterYear() {
    const year = new Date().getFullYear(); // Get the current year
    document.getElementById('year').textContent = year; // Set it to the element with id 'year'
}

// Call the function when the page loads
window.onload = () => {
    setFooterYear();
};


// Event listener for the generate button
document.getElementById('generate-button').addEventListener('click', function () {
    const disk = document.getElementById('disk').value;
    const vg = document.getElementById('vg').value;
    const lv = document.getElementById('lv').value;
    const mountPoint = document.getElementById('mount-point').value;

    // Generate commands by calling the modular functions
    const lvmCommands = generateLVMCommands(disk, vg, lv, mountPoint);
    const fstabEntry = generateFSTABEntry(vg, lv, mountPoint);
    const verifyCommands = generateVerificationCommands(mountPoint);
    const rsyncCommand = generateRsyncCommand(mountPoint);

    // Display the generated commands in the output sections
    document.getElementById('commands-output').textContent = lvmCommands;
    document.getElementById('fstab-output').textContent = fstabEntry;
    document.getElementById('verify-output').textContent = verifyCommands;
    document.getElementById('rsync-output').textContent = rsyncCommand;
});
