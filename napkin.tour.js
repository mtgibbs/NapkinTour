﻿function TourStep(controlToHighlight, imageHolder, arrowDirection, arrowPointCoordinates) {
    this.controlToHighlight = controlToHighlight;
    this.imageHolder = imageHolder;
    this.arrowDirection = arrowDirection;
    this.arrowPointCoordinates = arrowPointCoordinates;
}

function ImageHolder(imagePath, width, height) {
    this.imagePath = imagePath;
    this.height = height;
    this.width = width;
}

function Coordinate(x, y) {
    this.x = x;
    this.y = y;
}

function TourSequence() {
    this.tourSteps = [];
}

TourSequence.prototype.addStep = function(step) {
    this.tourSteps.push(step);
};

TourSequence.prototype.nextStep = function() {
    return this.tourSteps.shift();
};

TourSequence.prototype.hasNextStep = function() {
    return this.tourSteps.length > 0;
};

TourSequence.prototype.startTour = function() {

    var self = this;
    
    if (self.hasNextStep()) {
        var tourOverlay = $('<div id="tourOverlay"></div>').appendTo('body');
        var img = $('<img class="tourImage"> </img>').appendTo(tourOverlay);

        // keep people from dragging the image around
        $(img).on('dragstart', function (event) { event.preventDefault(); });

        tourOverlay.height($(document).height() + 100);
        // IE8 fix for fadeIn
        tourOverlay.css('filter', 'alpha(opacity=80)');
        tourOverlay.fadeIn(400, function() {

            var tourStep = self.nextStep();
            showStep(tourStep);

            // bind the click to pop the rest of the tour sequences after the first
            tourOverlay.click(function() {
                // if there's another sequence, hide the old one before exposing the new one.
                if (self.hasNextStep()) {
                    $(tourStep.controlToHighlight).unexpose();
                    tourStep = self.nextStep();
                    // fade out the existing slide
                    img.fadeOut(300, function() {
                        showStep(tourStep);
                    });
                } else {
                    // tour is over, go home
                    tourOverlay.fadeOut(800);
                }
            });

            $(window).resize(function() {
                console.log('resized');
                showStep(tourStep);
            });

        });
    }

    function showStep(tourStep) {
        var control = $(tourStep.controlToHighlight);
        control.expose();

        var image = $('.tourImage');

        if (tourStep.imageHolder !== null) {

            image.attr('src', tourStep.imageHolder.imagePath);
            image.css("height", tourStep.imageHolder.height);
            image.css("width", tourStep.imageHolder.width);

            var offset = calculateImagePosition(image, control, tourStep.arrowDirection, tourStep.arrowPointCoordinates);

            if (typeof offset !== 'undefined' && offset !== null) {
                image.css('left', offset.left);
                image.css('top', offset.top);
            }

            image.fadeIn(300);
        }
    }
};

function calculateImagePosition(image, control, pointerDirection, pointerCoord, distanceBetween) {

    var offset = { left: 0, top: 0 };

    // default the distance between to be something "nice" if none is specified
    // this is important since nothing ever specifies it right now!
    distanceBetween = typeof distanceBetween !== 'undefined' && distanceBetween !== null ? distanceBetween : 20;

    var imageWidth = image.width();
    var imageHeight = image.height();

    var controlHasOffset = typeof control.offset() !== 'undefined' && control.offset() !== null;
    var pointerCoordDefined = typeof pointerCoord !== 'undefined' && pointerCoord !== null;

    var leftEdge = controlHasOffset ? control.offset().left : 0;
    var bottomEdge = controlHasOffset ? control.offset().top + control.outerHeight() : 0;
    var middlePoint = controlHasOffset ? control.offset().left + control.outerWidth() / 2 : 0;

    var pointerY = 0;
    var pointerX = 0;

    switch (pointerDirection.toLowerCase()) {
    case 'ne':
        pointerY = pointerCoordDefined ? pointerCoord.y : 0;
        pointerX = pointerCoordDefined ? pointerCoord.x : imageWidth;

        offset.left = leftEdge - imageWidth + (imageWidth - pointerX) / 2;
        offset.top = bottomEdge - pointerY / 2;

        break;

    case 'nw':

        break;

    case 'se':

        break;

    case 'sw':

        break;

    case 'n':

        pointerY = pointerCoordDefined ? pointerCoord.y : 0;
        pointerX = pointerCoordDefined ? pointerCoord.x : imageWidth / 2;

        offset.left = middlePoint - pointerX;
        offset.top = bottomEdge - pointerY + distanceBetween;

        break;

    case 's':

        break;

    case 'e':
        break;

    case 'w':

        break;

    default:

        offset.left = pointerCoordDefined ? pointerCoord.x : 0;
        offset.top = pointerCoordDefined ? pointerCoord.y : 0;

    }

    return offset;
}

jQuery.fn.expose = function() {
    $(this).addClass('expose');
};

jQuery.fn.unexpose = function() {
    $(this).removeClass('expose');
};