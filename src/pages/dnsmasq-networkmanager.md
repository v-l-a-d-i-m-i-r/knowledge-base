# Using dnsmasq with NetworkManager

## Var 1 (using dns plugin)

1. ### Install dnsmasq:
    ``` sh
    sudo pacman -S dnsmasq
    ```

2. ### Configure NetworkManager (/etc/NetworkManager/NetworkManager.conf):
    ``` sh
    [main]
      plugins=ifcfg-rh,ibft
      dns=dnsmasq
    ```

3. ### Configure dnsmasq (/etc/NetworkManager/dnsmasq.d/cache.conf):
    ``` sh
    cache-size=1000
    no-negcache
    ```

4. ### Restart NetworkManager (make sure dnsmasq service is disabled):
    ``` sh
    sudo systemctl restart NetworkManager
    ```


## Var 2 (using resolvconf)

1. ### Install dnsmasq and openresolv:
    ``` sh
    sudo pacman -S dnsmasq openresolv
    ```

2. ### Configure NetworkManager (/etc/NetworkManager/NetworkManager.conf):
    ``` sh
    [main]
      plugins=ifcfg-rh,ibft
      dns=default 
      rc-manager=resolvconf
    ```

3. ### Configure dnsmasq (/etc/dnsmasq.conf):
    ``` sh
    cache-size=1000
    no-negcache
    ```

4. ### Add dnsmasq as a first nameserver configuring openresolv (/etc/resolv.conf.head:
    ``` sh
    # start /etc/resolv.conf.head

    name_servers=127.0.0.1

    # end /etc/resolv.conf.head
    ```

5. ### Enable and start dnsmasq service:
    ``` sh
    sudo systemctl enable dnsmasq
    sudo systemctl start dnsmasq
    ```

6. ### Restart the system


## See also:

[Using the NetworkManager’s DNSMasq plugin](https://fedoramagazine.org/using-the-networkmanagers-dnsmasq-plugin/)

[Advanced Dnsmasq Tips and Tricks](https://www.linux.com/topic/networking/advanced-dnsmasq-tips-and-tricks/)

[Archlinux Wiki dnsmasq](https://wiki.archlinux.org/title/dnsmasq)

[Разбираемся с локальными DNS](https://cdnnow.ru/blog/dnslocal/)

[Five nines with Dnsmasq](https://www.redhat.com/en/blog/five-nines-dnsmasq)

