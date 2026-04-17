const props = defineProps();
// Each variant has strokes alternating direction (LTR / RTL) spread across the full line height
// viewBox is 0 0 200 40 — strokes use y range ~5–35 so individual passes are clearly visible
const variants = [
    // classic scribble — slight downward drift, many passes
    [
        'M 1,5   C 70,6   130,6   199,8', // LTR ↘ gentle
        'M 199,13 C 130,11 70,13  1,11', // RTL ↙
        'M 1,15  C 80,13  120,16  199,18', // LTR ↘
        'M 199,10 C 110,8  90,10  1,7', // RTL ↖
        'M 1,20  C 60,18  140,20  199,22', // LTR →
        'M 199,26 C 120,24 80,27  1,25', // RTL ↙
        'M 1,28  C 70,26  130,29  199,30', // LTR →
        'M 199,33 C 110,31 90,34  1,32', // RTL →
    ],
    // slight upward tilt, many passes
    [
        'M 1,32  C 70,30  130,28  199,26', // LTR ↗ gentle
        'M 199,30 C 130,32 70,34  1,36', // RTL ↘
        'M 1,26  C 80,24  120,22  199,20', // LTR ↗
        'M 199,24 C 110,26 90,24  1,28', // RTL →
        'M 1,20  C 60,18  140,16  199,14', // LTR ↗
        'M 199,18 C 120,20 80,18  1,22', // RTL ↘
        'M 1,14  C 70,12  130,11  199,9', // LTR ↗
        'M 199,12 C 110,14 90,12  1,16', // RTL →
    ],
    // nervous — varied angles but reduced tilt
    [
        'M 1,8   C 50,10  100,7   199,12', // LTR wobbly
        'M 199,16 C 140,13 80,18  1,14', // RTL wobbly
        'M 1,20  C 60,17  110,22  199,18', // LTR wobbly
        'M 199,22 C 120,19 70,24  1,20', // RTL wobbly
        'M 1,26  C 90,23  110,27  199,24', // LTR wobbly
        'M 199,28 C 130,26 60,30  1,28', // RTL wobbly
        'M 1,32  C 70,30  140,33  199,30', // LTR wobbly
        'M 199,14 C 110,12 80,15  1,12', // RTL extra pass high
    ],
    // neat parallel — evenly spaced, very slight angle
    [
        'M 1,5   C 80,4   120,6   199,5', // LTR
        'M 199,11 C 110,12 90,10  1,11', // RTL
        'M 1,16  C 70,15  130,17  199,16', // LTR
        'M 199,21 C 100,22 80,20  1,21', // RTL
        'M 1,26  C 90,25  110,27  199,26', // LTR
        'M 199,31 C 100,32 80,30  1,31', // RTL
        'M 1,35  C 90,34  110,36  199,35', // LTR
    ],
    // relaxed arcs — gentle bows
    [
        'M 1,6   Q 100,12  199,7', // LTR shallow arch
        'M 199,14 Q 100,8   1,16', // RTL
        'M 1,19  Q 100,13  199,21', // LTR
        'M 199,25 Q 100,19  1,24', // RTL
        'M 1,28  Q 100,22  199,30', // LTR
        'M 199,33 Q 100,27  1,32', // RTL
        'M 1,36  Q 100,30  199,35', // LTR
        'M 199,10 Q 100,16  1,11', // RTL extra top
    ],
    // heavy pressure — overshoots edges
    [
        'M -5,5   C 60,7   140,6   205,9', // LTR ↘ gentle
        'M 205,14 C 130,12 70,15  -5,13', // RTL
        'M -5,18  C 70,16  130,19  205,22', // LTR
        'M 205,11 C 120,9  80,11  -5,8', // RTL ↖
        'M -5,25  C 80,23  120,26  205,28', // LTR
        'M 205,30 C 130,28 70,31  -5,29', // RTL
        'M -5,33  C 80,31  120,34  205,32', // LTR
        'M 205,19 C 120,17 80,20  -5,17', // RTL extra mid
    ],
];
const strokes = variants[props.seed % variants.length];
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "relative inline-block" },
});
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
var __VLS_0 = {};
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    ...{ class: "absolute inset-0 w-full h-full pointer-events-none" },
    viewBox: "0 0 200 40",
    preserveAspectRatio: "none",
    fill: "none",
    'aria-hidden': "true",
});
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
for (const [d, i] of __VLS_vFor((__VLS_ctx.strokes))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        key: (i),
        d: (d),
        stroke: "currentColor",
        'stroke-width': "1.5",
        'stroke-linecap': "round",
        'vector-effect': "non-scaling-stroke",
    });
    // @ts-ignore
    [strokes,];
}
// @ts-ignore
var __VLS_1 = __VLS_0;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    __typeProps: {},
});
const __VLS_export = {};
export default {};
