# Intel graphics issues

## Tearing 
1. ### Update intel settings (/etc/X11/xorg.conf.d/20-intel.conf)
    ``` sh
    Section "Device"
      Identifier  "Intel Graphics"
      Driver      "intel"
      Option      "TearFree" "true"
    EndSection
    ```

## Google chrome freezing
1. ### Update intel settings (/etc/X11/xorg.conf.d/20-intel.conf)
    ``` sh
    Section "Device"
      Identifier  "Intel Graphics"
      Driver      "intel"
      Option      "DRI" "2"
    EndSection
    ```
2. ### Set the invironment variable
    ``` sh
    LIBGL_DRI3_DISABLE=1
    ```
