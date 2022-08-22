var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Path, ScenePathChangeDetection } from './path';
import { BBox } from '../bbox';
import { LinearGradient } from '../gradient/linearGradient';
import { Color } from '../../util/color';
import { Shape } from './shape';
import { Path2D } from '../path2D';
export var RectSizing;
(function (RectSizing) {
    RectSizing[RectSizing["Content"] = 0] = "Content";
    RectSizing[RectSizing["Border"] = 1] = "Border";
})(RectSizing || (RectSizing = {}));
var Rect = /** @class */ (function (_super) {
    __extends(Rect, _super);
    function Rect() {
        var _this = _super.call(this, function (ctx) { return _this.renderRect(ctx); }) || this;
        _this.borderPath = new Path2D();
        _this.x = 0;
        _this.y = 0;
        _this.width = 10;
        _this.height = 10;
        _this.radius = 0;
        /**
         * If `true`, the rect is aligned to the pixel grid for crisp looking lines.
         * Animated rects may not look nice with this option enabled, for example
         * when a rect is translated by a sub-pixel value on each frame.
         */
        _this.crisp = false;
        _this.gradient = false;
        _this.lastUpdatePathStrokeWidth = Shape.defaultStyles.strokeWidth;
        _this.effectiveStrokeWidth = Shape.defaultStyles.strokeWidth;
        return _this;
    }
    Rect.prototype.updateGradientInstance = function () {
        var fill = this.fill;
        if (this.gradient) {
            if (fill) {
                var gradient = new LinearGradient();
                gradient.angle = 270;
                gradient.stops = [
                    {
                        offset: 0,
                        color: Color.fromString(fill).brighter().toString(),
                    },
                    {
                        offset: 1,
                        color: Color.fromString(fill).darker().toString(),
                    },
                ];
                this.gradientInstance = gradient;
            }
        }
        else {
            this.gradientInstance = undefined;
        }
        this.gradientFill = fill;
    };
    Rect.prototype.isDirtyPath = function () {
        var _a;
        if (this.lastUpdatePathStrokeWidth !== this.strokeWidth) {
            return true;
        }
        if (this.path.isDirty() || this.borderPath.isDirty() || ((_a = this.clipPath) === null || _a === void 0 ? void 0 : _a.isDirty())) {
            return true;
        }
        return false;
    };
    Rect.prototype.updatePath = function () {
        var _a;
        var _b = this, path = _b.path, borderPath = _b.borderPath, crisp = _b.crisp;
        var _c = this, x = _c.x, y = _c.y, w = _c.width, h = _c.height, strokeWidth = _c.strokeWidth;
        path.clear({ trackChanges: true });
        borderPath.clear({ trackChanges: true });
        if (crisp) {
            // Order matters here, since we need unaligned x/y for w/h calculations.
            w = this.align(x, w);
            h = this.align(y, h);
            x = this.align(x);
            y = this.align(y);
        }
        if (strokeWidth) {
            if (strokeWidth < w && strokeWidth < h) {
                var halfStrokeWidth = strokeWidth / 2;
                x += halfStrokeWidth;
                y += halfStrokeWidth;
                w -= strokeWidth;
                h -= strokeWidth;
                // Clipping not needed in this case; fill to center of stroke.
                this.borderClipPath = undefined;
                path.rect(x, y, w, h);
            }
            else {
                // Skip the fill and just render the stroke.
                this.borderClipPath = (_a = this.borderClipPath, (_a !== null && _a !== void 0 ? _a : new Path2D()));
                this.borderClipPath.clear({ trackChanges: true });
                this.borderClipPath.rect(x, y, w, h);
            }
            borderPath.rect(x, y, w, h);
        }
        else {
            // No borderPath needed, and thus no clipPath needed either. Fill to full extent of
            // Rect.
            this.borderClipPath = undefined;
            path.rect(x, y, w, h);
        }
        this.effectiveStrokeWidth = strokeWidth;
        this.lastUpdatePathStrokeWidth = strokeWidth;
    };
    Rect.prototype.computeBBox = function () {
        var _a = this, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        return new BBox(x, y, width, height);
    };
    Rect.prototype.isPointInPath = function (x, y) {
        var point = this.transformPoint(x, y);
        var bbox = this.computeBBox();
        return bbox.containsPoint(point.x, point.y);
    };
    Rect.prototype.renderRect = function (ctx) {
        var _a, _b;
        var _c = this, stroke = _c.stroke, effectiveStrokeWidth = _c.effectiveStrokeWidth, fill = _c.fill, path = _c.path, borderPath = _c.borderPath, borderClipPath = _c.borderClipPath, opacity = _c.opacity;
        var borderActive = !!stroke && !!effectiveStrokeWidth;
        if (fill) {
            var _d = this, gradientFill = _d.gradientFill, fillOpacity = _d.fillOpacity, fillShadow = _d.fillShadow;
            if (fill !== gradientFill) {
                this.updateGradientInstance();
            }
            var gradientInstance = this.gradientInstance;
            if (gradientInstance) {
                ctx.fillStyle = gradientInstance.createGradient(ctx, this.computeBBox());
            }
            else {
                ctx.fillStyle = fill;
            }
            ctx.globalAlpha = opacity * fillOpacity;
            // The canvas context scaling (depends on the device's pixel ratio)
            // has no effect on shadows, so we have to account for the pixel ratio
            // manually here.
            if (fillShadow && fillShadow.enabled) {
                var pixelRatio = (_b = (_a = this.scene) === null || _a === void 0 ? void 0 : _a.canvas.pixelRatio, (_b !== null && _b !== void 0 ? _b : 1));
                ctx.shadowColor = fillShadow.color;
                ctx.shadowOffsetX = fillShadow.xOffset * pixelRatio;
                ctx.shadowOffsetY = fillShadow.yOffset * pixelRatio;
                ctx.shadowBlur = fillShadow.blur * pixelRatio;
            }
            path.draw(ctx);
            ctx.fill();
            ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        }
        if (borderActive) {
            var _e = this, strokeOpacity = _e.strokeOpacity, lineDash = _e.lineDash, lineDashOffset = _e.lineDashOffset, lineCap = _e.lineCap, lineJoin = _e.lineJoin;
            if (borderClipPath) {
                // strokeWidth is larger than width or height, so use clipping to render correctly.
                // This is the simplest way to achieve the correct rendering due to nuances with ~0
                // width/height lines in Canvas operations.
                borderClipPath.draw(ctx);
                ctx.clip();
            }
            borderPath.draw(ctx);
            ctx.strokeStyle = stroke;
            ctx.globalAlpha = opacity * strokeOpacity;
            ctx.lineWidth = effectiveStrokeWidth;
            if (lineDash) {
                ctx.setLineDash(lineDash);
            }
            if (lineDashOffset) {
                ctx.lineDashOffset = lineDashOffset;
            }
            if (lineCap) {
                ctx.lineCap = lineCap;
            }
            if (lineJoin) {
                ctx.lineJoin = lineJoin;
            }
            ctx.stroke();
        }
    };
    Rect.className = 'Rect';
    __decorate([
        ScenePathChangeDetection()
    ], Rect.prototype, "x", void 0);
    __decorate([
        ScenePathChangeDetection()
    ], Rect.prototype, "y", void 0);
    __decorate([
        ScenePathChangeDetection()
    ], Rect.prototype, "width", void 0);
    __decorate([
        ScenePathChangeDetection()
    ], Rect.prototype, "height", void 0);
    __decorate([
        ScenePathChangeDetection()
    ], Rect.prototype, "radius", void 0);
    __decorate([
        ScenePathChangeDetection()
    ], Rect.prototype, "crisp", void 0);
    __decorate([
        ScenePathChangeDetection({ changeCb: function (r) { return r.updateGradientInstance(); } })
    ], Rect.prototype, "gradient", void 0);
    return Rect;
}(Path));
export { Rect };
