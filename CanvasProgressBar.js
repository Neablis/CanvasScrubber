var ProgressBar = function () {
    this.i = 0;
    this.value = 0;
    this.res = 0;
    this.context = null;
    this.total_width = 0;
    this.total_height = 0;
    this.radius = 0;
    this.initial_x = 0;
    this.initial_y = 0;
    this.div = undefined;
    this.elem = undefined;
    var tProgressBar = this;
	this.startX = 0;
	this.startY = 0;
	this.endX = 0;
	this.endY = 0;
	this.asName = 'progressBar';

    /**
     * return Value of bar
	 * @param {Object} Parent element to use for sizing and creation of progress bar
	 * @param {String} a unique name to give to your progress bar, used to have mulitple elements
     */
    ProgressBar.prototype.init = function (div, asName) {
        this.div = div;
		if( asName !== undefined ){
			this.asName = asName;
		}
		
        var canv = document.createElement("canvas");
        canv.innerText = "Your browser does not have support for canvas.";
        canv.setAttribute('id', this.asName);
        canv.style.position = 'absolute';

        this.div.appendChild(canv);

        this.elem = document.getElementById(this.asName);
        this.radius = this.div.offsetHeight / 2;
        this.initial_x = this.radius + (this.radius / 2);
        this.initial_y = (this.radius / 2);
        this.total_width = this.div.offsetWidth - (this.initial_x * 2);
        this.total_height = this.div.offsetHeight - (this.initial_y * 2);

        this.elem.width = this.div.offsetWidth;
        this.elem.height = this.div.offsetHeight;

        this.context = this.elem.getContext('2d');

        // green gradient for progress bar
        var progress_lingrad = this.context.createLinearGradient(0, this.initial_y + this.total_height, 0, 0);
        progress_lingrad.addColorStop(0, '#26B938');
        progress_lingrad.addColorStop(0.4, '#1E932C');
        progress_lingrad.addColorStop(1, '#1B8829');
        this.context.fillStyle = progress_lingrad;
        this.setValue(0);
		
        this.elem.onclick = function (aEvent) {
			var bar = tProgressBar;
            tProgressBar.sliderClick(aEvent, bar );
        };
        this.elem.onmousedown = function () {
			var bar = tProgressBar;
            tProgressBar.sliderMouseDown(bar);
        };

		this.elem.addEventListener('touchstart', function(e) { var bar = tProgressBar; tProgressBar.sliderMouseDown(bar); }, false);

    };
	
	/**
     * return the name given during init
     * @returns {String} a string name of the progressbar
     */
	ProgressBar.prototype.returnName = function () {
		return this.asName;
    };
	
	ProgressBar.prototype.sliderClick = function (aEvent, bar) {
        bar.sliderMouseMove(aEvent);
        bar.sliderMouseUp();
    };

    ProgressBar.prototype.sliderMouseDown = function (bar) {
        window.onmousemove = function (aEvent) {
            bar.sliderMouseMove(aEvent);
        };
		
        window.onmouseup = function () {
            bar.sliderMouseUp();
        };
		
		window.ontouchmove = function (aEvent) {
            bar.sliderMouseMove(aEvent);
        };
		
		window.ontouchend = function () {
            bar.sliderMouseUp();
        };
		
    };

    ProgressBar.prototype.sliderMouseMove = function (aEvent) {		
        var tRealX = aEvent.pageX - (this.FindDOMObjectLocation(document.getElementById(this.asName))[0] + this.initial_x);
        tRealX = (tRealX < 0) ? 0 : tRealX;
        tRealX = (tRealX > this.total_width) ? this.total_width : tRealX;
        this.i = tRealX;
        this.draw();
        this.draw();
    };

    ProgressBar.prototype.sliderMouseUp = function (aEvent) {
        window.onmousemove = null;
        window.onmouseup = null;
		window.ontouchmove = null;
        window.ontouchend = null;
    };
	
	/**
     * resizes the progress bar if its parent element happens to change
     */
	ProgressBar.prototype.resize = function () {
		
		var tempValue = this.getValue();
		
        this.elem = document.getElementById(this.asName);
        this.radius = this.div.offsetHeight / 2;
        this.initial_x = this.radius + (this.radius / 2);
        this.initial_y = (this.radius / 2);
        this.total_width = this.div.offsetWidth - (this.initial_x * 2);
        this.total_height = this.div.offsetHeight - (this.initial_y * 2);

        this.elem.width = this.div.offsetWidth;
        this.elem.height = this.div.offsetHeight;
		
		var progress_lingrad = this.context.createLinearGradient(0, this.initial_y + this.total_height, 0, 0);
        progress_lingrad.addColorStop(0, '#26B938');
        progress_lingrad.addColorStop(0.4, '#1E932C');
        progress_lingrad.addColorStop(1, '#1B8829');
        this.context.fillStyle = progress_lingrad;
		
		this.setValue(tempValue);

    };


    ProgressBar.prototype.draw = function () {
        this.context.clearRect(0, 0, this.elem.width, this.elem.height);
        this.progressLayerRect(this.context, this.initial_x, this.initial_y, this.total_width, this.total_height, this.radius);
        this.progressBarRect(this.context, this.initial_x, this.initial_y, this.i, this.total_height, this.radius, this.total_width);
    };

    /**
     * Set Value of bar
     * @param {Number} 0-100 percentage filled of bar
     */
    ProgressBar.prototype.setValue = function (aiValue) {
        if (aiValue > -1 || aiValue < 101) {
            this.i = ((aiValue * this.total_width) / 100);
            this.draw();
            this.draw();
        }
    };

    /**
     * return Value of bar
     * @returns {Number} 0-100 percentage of bar that is filled
     */
    ProgressBar.prototype.getValue = function () {
        return ((this.i * 100) / this.total_width);
    };
	
	 /**
     * return Value of bar
     * @returns {Object} Returns a object containing a progressbars locations in the dom
     */
	ProgressBar.prototype.returnDomLocation = function () {
        return this.FindDOMObjectLocation(this.elem);
    };


    /**
     * Find position of element in the dom.
     * @param {Object} Dom Element 
     * @returns {[x][y]} Array containing the X and Y position of element
     */
    ProgressBar.prototype.FindDOMObjectLocation = function (tObject) {
        var tiX = 0;
		var tiY = 0;

        if (tObject.offsetParent) {
            do {
                tiX += tObject.offsetLeft;
                tiY += tObject.offsetTop;
				tObject = tObject.offsetParent;
            } while (tObject);
        }

        return [tiX, tiY];
    };

    /**
     * Draws a rounded rectangle.
     * @param {CanvasContext} ctx
     * @param {Number} x The top left x coordinate
     * @param {Number} y The top left y coordinate
     * @param {Number} width The width of the rectangle
     * @param {Number} height The height of the rectangle
     * @param {Number} radius The corner radius;
     */
    ProgressBar.prototype.roundRect = function (ctx, x, y, width, height, radius) {
        ctx.arc(x + width, (y + radius) / 1.5, radius / 2, 3 * Math.PI / 2, Math.PI / 2, false);

        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.arc(x + radius, (y + radius) / 1.5, radius / 2, Math.PI / 2, 3 * Math.PI / 2, false);

        ctx.closePath();
        ctx.fill();
    };

    ProgressBar.prototype.progressLayerRect = function (ctx, x, y, width, height, radius) {

        ctx.save();

        // Create initial grey layer
        ctx.fillStyle = 'rgba(241,241,241,1)';
        this.roundRect(ctx, x, y, width, height, radius);

        // Overlay with gradient
        var lingrad = ctx.createLinearGradient(0, y + height, 0, 0);
        lingrad.addColorStop(0, 'rgba(255,255,255, 0.5)');
        lingrad.addColorStop(0.4, 'rgba(255,255,255, 0.8)');
        lingrad.addColorStop(1, 'rgba(255,255,255,0.7)');
        ctx.fillStyle = lingrad;
        this.roundRect(ctx, x, y, width, height, radius);

        ctx.fillStyle = 'rgba(255,255,255,0)';
        ctx.restore();
    };

    /**
     * Draws a half-rounded progress bar to properly fill rounded under-layer
     * @param {CanvasContext} ctx
     * @param {Number} x The top left x coordinate
     * @param {Number} y The top left y coordinate
     * @param {Number} width The width of the bar
     * @param {Number} height The height of the bar
     * @param {Number} radius The corner radius;
     * @param {Number} max The under-layer total width;
     */
    ProgressBar.prototype.progressBarRect = function (ctx, x, y, width, height, radius, max) {

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.arc(x + radius, (y + radius) / 1.5, radius / 2, Math.PI / 2, 3 * Math.PI / 2, false);
        ctx.closePath();
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.arc(x + width, radius, radius, 0, 2 * Math.PI, false);
        var progress_lingrad = ctx.createLinearGradient(0, radius * 2 + 5, 0, 0);
        progress_lingrad.addColorStop(0, '#9A9A9A');
        progress_lingrad.addColorStop(0.4, '#B8B8B8');
        progress_lingrad.addColorStop(1, '#BBBBBB');
        ctx.fillStyle = progress_lingrad;
        ctx.fill();
        ctx.restore();

    };
};