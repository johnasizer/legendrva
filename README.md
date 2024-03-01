# legendrva

## introduction

This project includes customizations made to the legendrva website. The website itself utilizes a hotel theme called [Hoteller](https://docs.themegoods.com/docs/hoteller) designed by ThemeGoods.
This heart and soul of this theme is the [Motopress Hotel Booking](https://motopress.com/files/motopress-hotel-booking-plugin-documentation.pdf) plugin, which includes a hotel booking engine.  After this theme was purchased
and as the requirements of the site expanded it became apparent that the features of this theme and plugin were limited.

This repository contains javascript and css customizations made to extend this theme's capability as much as possible.

## Usage

This project is not standalone, it is merely a storage vessel for the site customizations and its documentation.  Included in this
repo are reusable utility functions for the changes made to the reservation process. The majority of the changes made to the views in this theme
are done after the dom has been generated (using javascript). This will more easily allow the theme and motopress hotel booking plugin to be updated in the future.
The code which is specific to individual view manipulation is stored in Elementor.Ultimately in the future, a custom solution will be designed and developed from the ground up which will 
better suit the needs of the system.
