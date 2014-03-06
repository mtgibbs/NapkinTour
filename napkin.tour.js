function TourStep(controlToHighlight, imageHolder, arrowDirection, arrowPointCoordinates) {
    this.controlToHighlight = controlToHighlight;
    this.imageHolder = imageHolder;
    this.arrowDirection = arrowDirection;
    this.arrowPointCoordinates = arrowPointCoordinates;
}

TourStep.prototype.show = function() {
    var control = $(this.controlToHighlight).first();
    control.expose();

    var image = $('.tourImage');

    if (this.imageHolder !== null) {

        image.attr('src', this.imageHolder.imagePath);
        image.css('height', this.imageHolder.height);
        image.css('width', this.imageHolder.width);

        var offset = calculateImagePosition(image, control, this.arrowDirection, this.arrowPointCoordinates);

        if (typeof offset !== 'undefined' && offset !== null) {
            image.css('left', offset.left);
            image.css('top', offset.top);
        }

        image.fadeIn(300);
    }
};

function ImageHolder(imagePath, width, height) {
    this.imagePath = imagePath;
    this.height = height;
    this.width = width;
}

function ExitTourImage(imageHolder, offsetCoordinates, isVisibleAfterFirstStep) {
    this.imageHolder = imageHolder;
    if (typeof offsetCoordinates !== 'undefined' && offsetCoordinates !== null) {
        this.exitTourOffsetCoordinates = offsetCoordinates;
    } else {
        this.exitTourOffsetCoordinates = new Coordinate(0, 0);
    }
    this.isVisibleAfterFirstStep = typeof isVisibleAfterFirstStep === 'boolean' && isVisibleAfterFirstStep;
}

function Coordinate(x, y) {
    this.x = x;
    this.y = y;
}

function TourSequence(exitTourImage) {
    this.tourSteps = [];
    this.exitTourImage = exitTourImage;
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
        var tourOverlay = $('<div id="napkinTourOverlay"></div>').appendTo('body');
        var img = $('<img class="tourImage"> </img>').appendTo(tourOverlay);
        var closeImg = $('<img id="napkinTourClose"> </img>').appendTo(tourOverlay);

        var isExitTourImageDefined = typeof self.exitTourImage !== 'undefined' && self.exitTourImage !== null;
        
        // if the called defined an exit image, place it on the screen and bind a click event to cancel the tour
        if (isExitTourImageDefined) {
            closeImg.attr('src', self.exitTourImage.imageHolder.imagePath);
            closeImg.css('top', self.exitTourImage.exitTourOffsetCoordinates.y);
            closeImg.css('left', self.exitTourImage.exitTourOffsetCoordinates.x);

            closeImg.fadeIn(300);

            closeImg.click(function() {
                tourOverlay.fadeOut(800);
            });
        }

        // keep people from dragging the images around
        $(img).on('dragstart', function (event) { event.preventDefault(); });
        $(closeImg).on('dragstart', function (event) { event.preventDefault(); });

        var tourStep = self.nextStep();
        tourStep.show();
        
        // IE8 fix for fadeIn
        tourOverlay.css('filter', 'alpha(opacity=80)');
        tourOverlay.fadeIn(800).promise().done(function () {
            
            // bind window resize function to recalculate the current tourstep
            $(window).resize(function () {
                tourStep.show();
            });

            // bind the click to pop the rest of the tour sequences after the first
            tourOverlay.click(function () {
                
                if (isExitTourImageDefined && !self.exitTourImage.isVisibleAfterFirstStep) {
                    closeImg.fadeOut(300, function() {
                        this.hide();
                    });
                }

                // if there's another sequence, hide the old one before exposing the new one.
                if (self.hasNextStep()) {
                    $(tourStep.controlToHighlight).first().unexpose();
                    tourStep = self.nextStep();
                    // fade out the existing slide
                    img.fadeOut(300, function() {
                        tourStep.show();
                    });
                } else {
                    $(tourStep.controlToHighlight).first().unexpose();
                    // tour is over, go home
                    tourOverlay.fadeOut(800);
                }
            });
        });
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

    // determine the offsets for the edges of the control
    var leftEdge = controlHasOffset ? control.offset().left : 0;
    var rightEdge = leftEdge + control.outerWidth();
    var topEdge = controlHasOffset ? control.offset().top : 0;
    var bottomEdge = topEdge + control.outerHeight();
    var xMiddlePoint = controlHasOffset ? control.offset().left + control.outerWidth() / 2 : 0;
    var yMiddlePoint = controlHasOffset ? control.offset().top + control.outerHeight() / 2 : 0;

    var pointerY = 0;
    var pointerX = 0;

    switch (pointerDirection.toLowerCase()) {
    case 'ne':

        pointerY = pointerCoordDefined ? pointerCoord.y : 0;
        pointerX = pointerCoordDefined ? pointerCoord.x : imageWidth;

        offset.left = leftEdge - pointerX;
        offset.top = bottomEdge - pointerY / 2;

        break;

    case 'nw':

        pointerY = pointerCoordDefined ? pointerCoord.y : 0;
        pointerX = pointerCoordDefined ? pointerCoord.x : 0;

        offset.left = leftEdge + imageWidth + pointerX;
        offset.top = bottomEdge - pointerY / 2;
        break;

    case 'se':

        pointerY = pointerCoordDefined ? pointerCoord.y : imageHeight;
        pointerX = pointerCoordDefined ? pointerCoord.x : imageWidth;

        offset.left = leftEdge - pointerX;
        offset.top = topEdge - imageHeight + pointerY / 2;
        break;

    case 'sw':

        pointerY = pointerCoordDefined ? pointerCoord.y : imageHeight;
        pointerX = pointerCoordDefined ? pointerCoord.x : 0;

        offset.left = rightEdge + imageWidth + pointerX;
        offset.top = topEdge - imageHeight + pointerY / 2;
        break;

    case 'n':

        pointerY = pointerCoordDefined ? pointerCoord.y : 0;
        pointerX = pointerCoordDefined ? pointerCoord.x : imageWidth / 2;

        offset.left = xMiddlePoint - pointerX;
        offset.top = bottomEdge - pointerY + distanceBetween;

        break;

    case 's':

        pointerY = pointerCoordDefined ? pointerCoord.y : bottomEdge;
        pointerX = pointerCoordDefined ? pointerCoord.x : imageWidth / 2;

        offset.left = xMiddlePoint - pointerX;
        offset.top = topEdge - imageHeight + pointerY - distanceBetween;

        break;

    case 'e':

        pointerY = pointerCoordDefined ? pointerCoord.y : imageHeight / 2;
        pointerX = pointerCoordDefined ? pointerCoord.x : imageWidth;

        offset.left = leftEdge - pointerX - distanceBetween;
        offset.top = yMiddlePoint - pointerY;

        break;

    case 'w':

        pointerY = pointerCoordDefined ? pointerCoord.y : imageHeight / 2;
        pointerX = pointerCoordDefined ? pointerCoord.x : 0;
        
        offset.left = rightEdge - pointerX + distanceBetween;
        offset.top = yMiddlePoint - pointerY;
        break;

    default:

        offset.left = pointerCoordDefined ? pointerCoord.x : 0;
        offset.top = pointerCoordDefined ? pointerCoord.y : 0;

    }

    return offset;
}

jQuery.fn.expose = function() {
    $(this).addClass('napkintour-expose');
};

jQuery.fn.unexpose = function() {
    $(this).removeClass('napkintour-expose');
};