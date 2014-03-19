NapkinTour
==========
Made this script for giving a brief tour of a site while loading images (hopefully soon SVGs) with hand-drawn notes because I found a ton of great tooltip-like solutions but nothing that let you just doodle all over your website.  It calculates how to line the arrow up according to the direction that the arrow is specified to be pointing at.  Then it will black out the rest of the screen and just highlight the given div id.  Handles calculating the positions for tons of window sizes so you don't have to!

-----------------------

### Usage

Simply build a tourSequence that you wish to run.  Clicking the overlay at any time moves on to the next Step of the Sequence.  Provide the image and the size you want it to be and it will be placed into the overlay.  The script will then do it's best to line the arrow tip (specified as the Coordinate in the example) to the highlighted div without you having to worry about exactly where to place the image.  Window resizes are handled so they move with the button as it might change position as the window shrinks.

> Example:

```javascript
$(document).ready(function () {

   var tour = new TourSequence();
   tour.addStep(new TourStep('#button1', new ImageHolder('/images/getStartedExplain.png', 640, 400), 'ne', new Coordinate(544, 6)));
   tour.addStep(new TourStep('#navDiv', new ImageHolder('/images/navExplain.png', 640, 400), 'n', new Coordinate(126, 12)));
   tour.addStep(new TourStep('#search', new ImageHolder('/images/searchExplain.png', 640, 400), 'n', new Coordinate(289, 60)));
   tour.startTour();

});
```

### Future Feature Ideas

* .svg support with image fallback for IE
* Moving forward and backward through the tour.
* Better configuration options for timing and fade opacities.

### Dependencies

* jQuery
 

** Inspired by many junk mails from companies trying to show you all the great little things on their new product.**
