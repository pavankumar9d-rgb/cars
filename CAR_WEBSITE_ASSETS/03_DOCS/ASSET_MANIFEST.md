# CAR WEBSITE ASSET MANIFEST — V2

This package is organized for the scroll-driven R3F automotive website.

## Runtime assets

01_ASSEMBLY/
  fpv_car_assembly.mp4

02_VEHICLES/
  01_BLUE/
    blue_car.glb
    blue_car.png
    blue_car_exploded_reference.mp4
    exploded_reference_frames/...
  02_GREEN/
    green_car.glb
    green_car.png
    green_car_exploded_reference.mp4
    exploded_reference_frames/...
  03_RED/
    red_car.glb
    red_car.png
    red_car_exploded_reference.mp4
    exploded_reference_frames/...
  04_WHITE/
    white_car.glb
    white_car.png
    white_car_exploded_reference.mp4
    exploded_reference_frames/...

## Important
- All four color variants now have a dedicated exploded-view reference video.
- All four variants have extracted exploded-view image frames.
- The actual interactive exploded animation must use the GLB scene graph,
  not the MP4 or JPG sequence as the primary 3D mechanism.
- The videos/frames are visual timing/reference material and fallback material.
- Do not invent vehicle specifications; no verified spec sheet was supplied.
- Do not invent an orbit video; the 360-degree orbit should be generated
  interactively from the GLB/camera.
- The GLBs are starter/procedural models and should be inspected before
  assigning semantic exploded-part mappings.
