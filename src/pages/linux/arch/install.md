# Installation Arch linux under Manjaro

### 0. Enable the root previlegies for the current user(username: manjaro, password: manjaro)
``` sh
su
```

### 1. Patch the mirrorlist file
``` sh
# fetch the list of servers
curl https://www.archlinux.org/mirrorlist/all/ > /etc/pacman.d/mirrorlist

# check that file /etc/pacman.d/mirrorlist was updated successfully
nano /etc/pacman.d/mirrorlist

# uncomment all servers
sed -i 's/^#Server/Server/' /etc/pacman.d/mirrorlist

# sync the pacman's databases
pacman -Sy
```

### 2. Install the arch install scripts
``` sh
pacman -S --noconfirm arch-install-scripts
```

### 3. Add and format the partitions (using gparted) after unmounting

### 4. Mount the filesystems to the /mnt folder.
``` sh
# list of disks
fdisk -l

mount /dev/sda1 /mnt

# create the nested folder
mkdir /mnt/data

mount /dev/sda3 /mnt/data

# mount the swap
swapon /dev/sda2

# for UEFI
mkdir /mnt/boot
mkdir /mnt/boot/efi
mount /dev/sda2 /mnt/boot/efi
```

### 5. Instal the base packages
``` sh
pacstrap /mnt base base-devel

# For the lts kernel
pacstrap /mnt $(pacman -Sqg base | sed 's/^\(linux\)$/\1-lts/') linux-lts-headers base-devel
```

### 6. Generate the fstab file
``` sh
genfstab -pU /mnt >> /mnt/etc/fstab

# check the fstab file
nano /mnt/etc/fstab
```

### 7. Dive into installed os
``` sh
arch-chroot /mnt
```
#### 7.1 Sync the pacman's databases
``` sh
# add multilib repos
echo -e "[multilib]\nInclude = /etc/pacman.d/mirrorlist" >> /etc/pacman.conf

pacman -Syu
```

#### 7.2 Set local time
``` sh
ln -sf /usr/share/zoneinfo/Europe/Kiev /etc/localtime
```

#### 7.3 Generate locales
``` sh
# set the USA locale
sed -i 's/^#en_US.UTF-8/en_US.UTF-8/' /etc/locale.gen

# set the rus locale
sed -i 's/^#ru_RU.UTF-8/ru_RU.UTF-8/' /etc/locale.gen

# check the result
cat /etc/locale.gen | grep -v '^#'

# generate the locale
locale-gen
```

#### 7.4 Set the system language
``` sh
echo "LANG=\"en_US.UTF-8\"" > /etc/locale.conf
```

#### 7.5 Set the console keymap
``` sh
echo -e "KEYMAP=us\nFONT=cyr-sun16" > /etc/vconsole.conf
```

#### 7.6 Set the hostname (e.g my-pc)
``` sh
echo "my-pc" > /etc/hostname
```

### 7.7 Se the users and passwords
``` sh
#set the password for root
passwd

# set the other user (e.g. someuser)
useradd -m -g users -G wheel -s /bin/bash someuser

# set the password for other user (e.g. someuser)
passwd someuser
```

#### 7.8 Patch the sudoers file
``` sh
sed -i 's/^# %wheel ALL=(ALL) ALL/%wheel ALL=(ALL) ALL/' /etc/sudoers
```

#### 7.9 Create RAM image
``` sh
mkinitcpio -p linux

# For lts kernel
mkinitcpio -p linux-lts
```

#### 7.10 Install and configure GRUB
``` sh
pacman -S --noconfirm grub (for all types)

# BIOS (only)
grub-install /dev/sdx

# UEFI (only)
pacman -S --noconfirm efibootmgr
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=grub

grub-mkconfig -o /boot/grub/grub.cfg (for all types)
```

#### 7.11 Install and configure the network utils (for using run wifi-menu)
``` sh
# wireless utils (for using run wifi-menu)
pacman -S --noconfirm netctl dialog wpa_supplicant

# for using run wifi connection
sudo wifi-menu

# for using run wire connection
sudo systemctl start dhcpcd
```

#### 7.12 Clean pacman cache
``` sh
pacman -S --noconfirm pacman-contrib
paccache -rk 0
```

#### 7.13 Exit from arch-chroot mode
``` sh
exit
```

### 8. Unmount the filesystems from the /mnt folder
``` sh
umount /mnt/data /mnt/boot/efi /mnt
```

### 9. Reboot the system
