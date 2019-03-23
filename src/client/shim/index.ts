import domProcessor from '../dom-processor';
import * as domUtils from '../utils/dom';
import nativeMethods from '../sandbox/native-methods';
import ElementSandbox from '../sandbox/node/element';

const setAttributeCore = ElementSandbox.prototype.setAttributeCore;

ElementSandbox.prototype.setAttributeCore = function (el, args, isNs?: boolean) {
    const ns          = isNs ? args[0] : null;
    const attr        = String(args[isNs ? 1 : 0]);
    // const loweredAttr = attr.toLowerCase();
    const valueIndex  = isNs ? 2 : 1;
    const value       = String(args[valueIndex]);
    const setAttrMeth = isNs ? nativeMethods.setAttributeNS : nativeMethods.setAttribute;
    const tagName     = domUtils.getTagName(el);
    const isUrlAttr   = domProcessor.isUrlAttr(el, attr, ns);
    // const isEventAttr = domProcessor.EVENTS.indexOf(attr) !== -1;

    if (isUrlAttr) {
        switch (tagName + '.' + attr) {
            case 'iframe.src':
                console.log('[ElementSandbox] Nullify iframe src: ' + value); // eslint-disable-line no-console
                return null; // nullify all iframe src setting
            case 'img.src':
            case 'video.src':
            case 'link.href':
                console.log('[ElementSandbox] Skip src/href processing on <' + tagName + '>:' + value); // eslint-disable-line no-console
                return setAttrMeth.apply(el, args); // skip processing on resources
        }
    }

    return setAttributeCore.apply(this, arguments);
};
