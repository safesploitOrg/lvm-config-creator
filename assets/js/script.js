let currentMode = 'create'; // default mode

// --- Tab Management ---
function openTab(evt, tabName) {
  const tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  const tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";

  currentMode = tabName.toLowerCase();

  // Toggle mount point input group
  const mountPoint = document.getElementById('mount-point').value;


}

// --- Command Generators ---
function generateLVMCommands(disk, vg, lv, mountPoint) {
  return `
# LVM Creation
pvcreate ${disk}
vgcreate ${vg} ${disk}
lvcreate -n ${lv} -l 100%FREE ${vg}
mkfs.xfs /dev/${vg}/${lv}
mkdir -p ${mountPoint}
  `;
}

function generateFSTABEntry(vg, lv, mountPoint) {
  return `
# fstab entry
/dev/${vg}/${lv}        ${mountPoint}          xfs nofail,usrquota,grpquota 0 0
  `;
}

function generateVerificationCommands(mountPoint) {
  return `
# Reload and Verify
systemctl daemon-reload
mount -a
df -h | grep ${mountPoint}
  `;
}

function generateRsyncCommand(mountPoint) {
  return `
# Data Migration (Local)
rsync -av --delete /oldPath/ ${mountPoint}/

# Data Migration (Remote)
rsync -av --delete /oldPath/ root@remoteHost:${mountPoint}/
  `;
}

function generateResizeCommands(disk, vg, lv, mountPoint) {
  const mp = mountPoint || `/mnt/${lv}`;
  return `
# Unmount Filesystem
umount -fl ${mp}

# Resize Physical Volume
pvresize ${disk}

# Extend Logical Volume
lvextend -l +100%FREE /dev/${vg}/${lv}

# Grow Filesystem
xfs_growfs ${mp}

# Remount Filesystem
mount ${mp}

# Confirm Resize
df -h | grep ${mp}
  `;
}

// --- Shared Handler ---
function generateCommands(mode) {
  const disk = document.getElementById('disk').value;
  const vg = document.getElementById('vg').value;
  const lv = document.getElementById('lv').value;
  const mountPoint = document.getElementById('mount-point').value;

  if (mode === 'create') {
    document.getElementById('commands-output').textContent = generateLVMCommands(disk, vg, lv, mountPoint);
    document.getElementById('fstab-output').textContent = generateFSTABEntry(vg, lv, mountPoint);
    document.getElementById('verify-output').textContent = generateVerificationCommands(mountPoint);
    document.getElementById('rsync-output').textContent = generateRsyncCommand(mountPoint);
  }

  if (mode === 'resize') {
    const mp = mountPoint || `/mnt/${lv}`;
    document.getElementById('resize-output').textContent = generateResizeCommands(disk, vg, lv, mp);
  }
}

// --- Initialisers ---
function initSharedForm() {
  document.getElementById('generate-button').addEventListener('click', () => {
    // generateCommands(currentMode);

    // Generate for both 'create' and 'resize'
    generateCommands('create');
    generateCommands('resize');
  });
}

function setFooterYear() {
  const year = new Date().getFullYear();
  document.getElementById('year').textContent = year;
}

function main() {
  setFooterYear();
  initSharedForm();
  document.getElementById("createTab").click(); // default tab
}

// --- Run ---
main();
