# Handle captive portals with NetworkManager

## Install min browser
``` sh
  sudo pacman -S min
```

## Add script (/etc/NetworkManager/dispatcher.d/90-open_captive_portal)
``` sh


    #!/bin/sh -e
    # Script to dispatch NetworkManager events
    #
    # Runs shows a login webpage on walled garden networks.
    # See NetworkManager(8) for further documentation of the dispatcher events.

    PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

    if [ -x "/usr/bin/logger" ]; then
      logger="/usr/bin/logger -s -t captive-portal"
    else
      logger=":"
    fi

    wait_for_process() {
      PNAME=$1
      while [ -z "$(/usr/bin/pgrep $PNAME)" ]; do
        sleep 3;
      done
    }

    # Function to retrieve the captive portal login page URL
    get_captive_portal_url() {
      local gateway=$(ip route show default | awk '/default/ {print $3}')
      local login_page=$(curl -sILk -m 5 "http://$gateway" --request GET | awk '/Location:/ {print $2}')
      echo "$login_page"
    }

    #launch the browser, but on boot we need to wait that nm-applet starts
    start_browser() {
      local user="$1"
      local display="$2"

      export DISPLAY="$display"
      wait_for_process nm-applet

      export XAUTHORITY="/home/$user/.Xauthority"
      local captive_portal_url=$(get_captive_portal_url)

      $logger "Running browser as '$user' with display '$display' to login in captive portal '$captive_portal_url'"
      # sudo -u "$user" --preserve-env=DISPLAY,XAUTHORITY -H xdg-open "$captive_portal_url" 2>&1 > /dev/null
      sudo -u "$user" --preserve-env=DISPLAY,XAUTHORITY -H min "$captive_portal_url" 2>&1 > /dev/null
    }

    on_connectivity_state_portal() {
      wait_for_process nm-applet

      who | awk '{ print $1 }' | sort | uniq | \
      while read user; do
        local user_nm_applet_pid=$(ps aux | grep nm-applet | grep $user | grep -v grep | awk '{ print $2 }')
        local display=$(sudo cat /proc/$user_nm_applet_pid/environ | tr '\0' '\n' | grep ^DISPLAY= | cut -d "=" -f 2)

        start_browser "vladimir" ":0" || $logger -p user.err "Failed for user: '$user' display: '$display'"
      done
    }

    # Run the right scripts
    case "$2" in
      connectivity-change)
        $logger -p user.debug "dispatcher script triggered on connectivity change: $CONNECTIVITY_STATE"

        if [ "$CONNECTIVITY_STATE" = "PORTAL" ]; then
        # if [ "$CONNECTIVITY_STATE" = "FULL" ]; then
          on_connectivity_state_portal;
        fi
      ;;
      *)
      # In a down phase
      exit 0
      ;;
    esac
```
