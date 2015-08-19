SvgDownload = (function () {
    var self = this;
    var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

    window.URL = (window.URL || window.webkitURL);

    var body = document.body;

    var prefix = {
        xmlns: "http://www.w3.org/2000/xmlns/",
        xlink: "http://www.w3.org/1999/xlink",
        svg: "http://www.w3.org/2000/svg"
    }


    //initialize();

    //function initialize() {
    //    var documents = [window.document],
    //        SVGSources = [];
    //    iframes = document.querySelectorAll("iframe"),
    //        objects = document.querySelectorAll("object");
    //
    //    [].forEach.call(iframes, function(el) {
    //        try {
    //            if (el.contentDocument) {
    //                documents.push(el.contentDocument);
    //            }
    //        } catch(err) {
    //            console.log(err)
    //        }
    //    });
    //
    //    [].forEach.call(objects, function(el) {
    //        try {
    //            if (el.contentDocument) {
    //                documents.push(el.contentDocument);
    //            }
    //        } catch(err) {
    //            console.log(err)
    //        }
    //    });
    //
    //    documents.forEach(function(doc) {
    //        var styles = getStyles(doc);
    //        var newSources = getSources(doc, styles);
    //        // because of prototype on NYT pages
    //        for (var i = 0; i < newSources.length; i++) {
    //            SVGSources.push(newSources[i]);
    //        };
    //    });
    //    if (SVGSources.length > 1) {
    //        createPopover(SVGSources);
    //    } else if (SVGSources.length > 0) {
    //        download(SVGSources[0]);
    //    } else {
    //        alert("The Crowbar couldn’t find any SVG nodes.");
    //    }
    //}

    function createPopover(sources) {
        cleanup();

        sources.forEach(function (s1) {
            sources.forEach(function (s2) {
                if (s1 !== s2) {
                    if ((Math.abs(s1.top - s2.top) < 38) && (Math.abs(s1.left - s2.left) < 38)) {
                        s2.top += 38;
                        s2.left += 38;
                    }
                }
            })
        });

        var buttonsContainer = document.createElement("div");
        body.appendChild(buttonsContainer);

        buttonsContainer.setAttribute("class", "svg-crowbar");
        buttonsContainer.style["z-index"] = 1e7;
        buttonsContainer.style["position"] = "absolute";
        buttonsContainer.style["top"] = 0;
        buttonsContainer.style["left"] = 0;


        var background = document.createElement("div");
        body.appendChild(background);

        background.setAttribute("class", "svg-crowbar");
        background.style["background"] = "rgba(255, 255, 255, 0.7)";
        background.style["position"] = "fixed";
        background.style["left"] = 0;
        background.style["top"] = 0;
        background.style["width"] = "100%";
        background.style["height"] = "100%";

        sources.forEach(function (d, i) {
            var buttonWrapper = document.createElement("div");
            buttonsContainer.appendChild(buttonWrapper);
            buttonWrapper.setAttribute("class", "svg-crowbar");
            buttonWrapper.style["position"] = "absolute";
            buttonWrapper.style["top"] = (d.top + document.body.scrollTop) + "px";
            buttonWrapper.style["left"] = (document.body.scrollLeft + d.left) + "px";
            buttonWrapper.style["padding"] = "4px";
            buttonWrapper.style["border-radius"] = "3px";
            buttonWrapper.style["color"] = "white";
            buttonWrapper.style["text-align"] = "center";
            buttonWrapper.style["font-family"] = "'Helvetica Neue'";
            buttonWrapper.style["background"] = "rgba(0, 0, 0, 0.8)";
            buttonWrapper.style["box-shadow"] = "0px 4px 18px rgba(0, 0, 0, 0.4)";
            buttonWrapper.style["cursor"] = "move";
            buttonWrapper.textContent = "SVG #" + i + ": " + (d.id ? "#" + d.id : "") + (d.class ? "." + d.class : "");

            var button = document.createElement("button");
            buttonWrapper.appendChild(button);
            button.setAttribute("data-source-id", i)
            button.style["width"] = "150px";
            button.style["font-size"] = "12px";
            button.style["line-height"] = "1.4em";
            button.style["margin"] = "5px 0 0 0";
            button.textContent = "Download";

            button.onclick = function (el) {
                // console.log(el, d, i, sources)
                download(d);
            };

        });

    }

    function cleanup() {
        var crowbarElements = document.querySelectorAll(".svg-crowbar");

        [].forEach.call(crowbarElements, function (el) {
            el.parentNode.removeChild(el);
        });
    }


    function getSources(doc, styles) {
        var svgInfo = [],
            svgs = doc.querySelectorAll("svg");

        styles = (styles === undefined) ? "" : styles;

        [].forEach.call(svgs, function (svg) {

            svg.setAttribute("version", "1.1");

            var defsEl = document.createElement("defs");
            svg.insertBefore(defsEl, svg.firstChild); //TODO   .insert("defs", ":first-child")
            // defsEl.setAttribute("class", "svg-crowbar");

            var styleEl = document.createElement("style")
            defsEl.appendChild(styleEl);
            styleEl.setAttribute("type", "text/css");


            // removing attributes so they aren't doubled up
            svg.removeAttribute("xmlns");
            svg.removeAttribute("xlink");

            // These are needed for the svg
            if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) {
                svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
            }

            if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) {
                svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
            }

            var source = (new XMLSerializer()).serializeToString(svg).replace('</style>', '<![CDATA[' + styles + ']]></style>');
            var rect = svg.getBoundingClientRect();
            svgInfo.push({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                class: svg.getAttribute("class"),
                id: svg.getAttribute("id"),
                childElementCount: svg.childElementCount,
                source: [doctype + source]
            });
        });
        return svgInfo;
    }

    function getSource(svg) {
        var styles = getStyles(document);
        styles = (styles === undefined) ? "" : styles;

        svg.setAttribute("version", "1.1");

        var defsEl = document.createElement("defs");
        svg.insertBefore(defsEl, svg.firstChild); //TODO   .insert("defs", ":first-child")
        // defsEl.setAttribute("class", "svg-crowbar");

        var styleEl = document.createElement("style")
        defsEl.appendChild(styleEl);
        styleEl.setAttribute("type", "text/css");


        // removing attributes so they aren't doubled up
        svg.removeAttribute("xmlns");
        svg.removeAttribute("xlink");

        // These are needed for the svg
        if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) {
            svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
        }

        if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) {
            svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
        }

        var source = (new XMLSerializer()).serializeToString(svg).replace('</style>', '<![CDATA[' + styles + ']]></style>');
        var rect = svg.getBoundingClientRect();
        return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            class: svg.getAttribute("class"),
            id: svg.getAttribute("id"),
            childElementCount: svg.childElementCount,
            source: [doctype + source]
        };
    }

    self.download = function (svg) {
        download(getSource(svg));
    };

    function download(source) {
        var filename = "untitled";

        if (source.id) {
            filename = source.id;
        } else if (source.class) {
            filename = source.class;
        } else if (window.document.title) {
            filename = window.document.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        }
        var url = "data:text/xml;charset=utf-8,"+encodeURI(source.source);

        //source.source.forEach(function(infoArray, index){
        //    dataString = infoArray.join(",");
        //    csvContent += index < data.length ? dataString+ "\n" : dataString;
        //
        //});
        //var url = window.URL.createObjectURL(new Blob(source.source, {"type": "text\/xml"}));
        //console.log(url);
        Downer({'001.svg': url});
        //window.downloadFile(url);
        //var a = document.createElement("a");
        //document.body.appendChild(a);
        //a.setAttribute("class", "svg-crowbar");
        //a.setAttribute("download", filename + ".svg");
        //a.setAttribute("href", url);
        //a.style["display"] = "none";
        //a.click();
        //
        //setTimeout(function () {
        //    window.URL.revokeObjectURL(url);
        //}, 10);
    }

    function getStyles(doc) {
        var styles = "",
            styleSheets = doc.styleSheets;

        if (styleSheets) {
            for (var i = 0; i < styleSheets.length; i++) {
                processStyleSheet(styleSheets[i]);
            }
        }

        function processStyleSheet(ss) {
            if (ss.cssRules) {
                for (var i = 0; i < ss.cssRules.length; i++) {
                    var rule = ss.cssRules[i];
                    if (rule.type === 3) {
                        // Import Rule
                        processStyleSheet(rule.styleSheet);
                    } else {
                        // hack for illustrator crashing on descendent selectors
                        if (rule.selectorText) {
                            if (rule.selectorText.indexOf(">") === -1) {
                                styles += "\n" + rule.cssText;
                            }
                        }
                    }
                }
            }
        }

        return styles;
    }

    return self;

})();
EditorsInputs = function() {
    var self = this;

    self.elementInputs = {
        //'text': ['text', 'transformX', 'transformY', 'fontSize', 'fontFamily'],
        //'textPath': ['text', 'transformX', 'transformY', 'fontSize', 'fontFamily'],
        'text': ['text'],
        'textPath': ['text'],
        'textpath': ['text'],
        'tspan': ['text']
    };

    var fontSizes = {
        '': '默认',
        "6px": "6px",
        "7px": "7px",
        "8px": "8px",
        "9px": "9px",
        "10px": "10px",
        "11px": "11px",
        "12px": "12px",
        "13px": "13px",
        "14px": "14px",
        "15px": "15px",
        "16px": "16px",
        "17px": "17px",
        "18px": "18px",
        "19px": "19px",
        "20px": "20px",
        "21px": "21px",
        "22px": "22px",
        "23px": "23px",
        "24px": "24px",
        "25px": "25px",
        "26px": "26px",
        "27px": "27px",
        "28px": "28px",
        "29px": "29px",
        "30px": "30px",
        "31px": "31px",
        "32px": "32px",
        "33px": "33px",
        "34px": "34px",
        "35px": "35px",
        "36px": "36px",
        "37px": "37px",
        "38px": "38px",
        "39px": "39px",
        "40px": "40px",
        "41px": "41px",
        "42px": "42px",
        "43px": "43px",
        "44px": "44px",
        "45px": "45px",
        "46px": "46px",
        "47px": "47px",
        "48px": "48px",
        "49px": "49px",
        "50px": "50px",
        "51px": "51px",
        "52px": "52px",
        "53px": "53px",
        "54px": "54px",
        "55px": "55px",
        "56px": "56px"
    };
    var fontFamilies = {
        '': '默认',
        "Serif":"Serif",
        "Sans-serif":"Sans-serif",
        "Monospace":"Monospace",
        "Cursive":"Cursive",
        "Fantasy":"Fantasy"
    }

    self.x = {
        label: '水平偏移',
        init: function(dom) {
            var value = $(dom).attr('x');
            return $("<input type='number' value="+value+">")
        },
        changeCallback: function(dom, value) {
            $(dom).attr('x', value);
        }
    };

    self.y = {
        label: '垂直偏移',
        init: function(dom) {
            var value = $(dom).attr('y') - Number($(dom).height());

            return $("<input type='number' value="+value+">")
        },
        changeCallback: function(dom, value) {
            $(dom).attr('y', Number(value) + Number($(dom).height()));
        }
    };

    self.transformX = {
        label: '垂直偏移',
        init: function(dom) {
            var my = this;
            var value = this.getTransformValue(dom);
            var $input = $("<input type='number'>");
            $input.val(value);
            dom.on('change', function() {
                $input.val(my.getTransformValue(dom));
            });
            return $input
        },
        changeCallback: function(dom, value) {
            if($.trim(value) != '') {
                var oldValue = $.trim($(dom).attr('transform'));
                $(dom).attr('transform', oldValue.replace(/translate\(\d+\,/, 'translate('+Number(value)+ ','));
            }

        },
        getTransformValue: function(dom) {
            return Number($.trim($(dom).attr('transform')).replace('translate(', '').split(',')[0])
        }
    };

    self.transformY = {
        label: '垂直偏移',
        init: function(dom) {
            var my = this;
            var value = this.getTransformValue(dom);
            var $input = $("<input type='number'>");
            $input.val(value);
            dom.on('change', function() {
                $input.val(my.getTransformValue(dom));
            });
            return $input
        },
        changeCallback: function(dom, value) {
            if($.trim(value) != '') {
                var oldValue = $.trim($(dom).attr('transform'));
                $(dom).attr('transform', oldValue.replace(/\,\d+\)/, ',' + Number(value) + ')'));
            }
        },
        getTransformValue: function(dom) {
            return Number($.trim($(dom).attr('transform')).replace(/translate\(\d+\,/, '').split(')')[0])
        }
    };

    self.text = {
        label: '文字',
        init: function(dom) {
            var value = $(dom).text();
            var $input = $("<input type='text'>");
            return $input.val(value)
        },
        changeCallback: function(dom, value) {
            $(dom).text(value);
        }
    };

    self.fontSize = {
        label: '字号',
        init: function(dom) {
            var value = $(dom).attr('font-size');
            var $input = $('<select></select>');
            $.each(fontSizes, function(key, label) {
                var $option = $('<option value="'+key+'">'+label+'</option>');
                if(key == $.trim(value)) {
                    $option.attr('selected', 'selected');
                }
                $input.append($option)
            });
            return $input;
        },
        changeCallback: function(dom, value) {
            $(dom).attr('font-size', value);
        }
    };

    self.fontFamily = {
        label: '字体',
        init: function(dom) {
            var value = $(dom).attr('font-family');
            var $input = $('<select></select>');
            $.each(fontFamilies, function(key, label) {
                var $option = $('<option value="'+key+'">'+label+'</option>');
                if(key == $.trim(value)) {
                    $option.attr('selected', 'selected');
                }
                $input.append($option)
            });
            return $input;
        },
        changeCallback: function(dom, value) {
            $(dom).attr('font-family', value);
        }
    };




    return self;
}();

SvgConfig = function() {
    var self = this;
    self.host = "";
    self.port = "80";

    return self;
}();

SvgEditor = function(dom) {
    var self = this;

    self.$dom = $(dom);

    self.$panel = $('<div class="svg-panel"></div>');
    self.$editor = $('<div class="svg-editor"></div>');

    self.$dom.append(self.$panel).append(self.$editor);
    self.imageUrl = "";
    //self.currentTargetId;


    //self.$dom.find('*').on('click', function(e) {
    //    var dom = $(e.target);
    //    console.log(dom[0].tagName);
    //    if(self.currentTargetId != dom.attr('id')) {
    //        self.currentTargetId = dom.attr('id');
    //        if(EditorsInputs.elementInputs[dom[0].tagName] != undefined ) {
    //            self.rebuildEditor(dom, EditorsInputs.elementInputs[dom[0].tagName])
    //        }
    //    }
    //
    //});

    self.refreshOperate = function() {
        var $operate = $('<div class="svg-operate"></div>');
        var $download = $('<a class="svg-download btn btn-info" href="javascript: void(0)">下载</a>');
        $operate.append($download);
        self.$editor.append($operate);
        $operate.on('click', function() {
           SvgDownload.download(self.$panel.find('svg')[0])
        });
    }


    self.refreshPanel = function() {
        self.$editor.html('');
        self.refreshOperate();
        $.each(self.$panel.find('svg').find('text, textPath, tspan, textpath'), function(i, dom) {
            var $dom = $(dom);
            if(EditorsInputs.elementInputs[$dom[0].tagName] != undefined ) {
                if($dom.children().length == 0) {
                    self.rebuildEditor($dom, EditorsInputs.elementInputs[$dom[0].tagName])
                }
            }
        });
    };

    self.load = function(url) {
        if(self.imageUrl != url) {
            self.imageUrl = url;
            var a = $('<a></a>');
            a.attr('href', url);
            a[0].host = location.host;
            a[0].port = location.port || 80;
            $.ajax({
                type: 'GET',
                url: a[0].href,
                success: function(data) {
                    var $svg = $(data.documentElement);
                    self.$panel.html("");
                    self.$panel.append($svg);
                    self.refreshPanel();
                }
            });
        }
    };

    self.udraggable = function() {
        self.$panel.find('svg *').udraggable({
            containment: 'parent',
            positionElement: function ($el, dragging, x, y) {
                if (dragging) {
                    $el.css({
                        left: 'auto',
                        top: 'auto',
                        transform: 'translate(' + x + 'px,' + y + 'px)'
                    });
                    $el.attr('transform', 'translate(' + x + ',' + y + ')');
                    $el.trigger('change');
                }
                else {
                    $el.css({
                        left: x,
                        top: y,
                        transform: 'none'
                    });
                }
            }
        });

        self.$panel.find('svg *').css({left: 'auto', top: 'auto'})
    };

    self.rebuildEditor = function(dom, inputs) {
        var $domPanel = $('<div class="editor-item"></div>');

        $.each(inputs, function(i, inputName) {
            var input = EditorsInputs[inputName];
            var $div = $('<div></div>');
            var $label = $("<label>"+input.label+"</label>");
            var $input = input.init(dom);
            $div.append($label).append($input);
            $domPanel.append($div);
            self.$editor.append($domPanel);

            $input.on('change', function(e) {
                input.changeCallback(dom, $input.val());
            });

            $input.on('keyup', function(e) {
                input.changeCallback(dom, $input.val());
            });

        })

    }

};

window.downloadFile = function(sUrl) {

    //If in Chrome or Safari - download via virtual link click
    if (window.downloadFile.isChrome || window.downloadFile.isSafari) {
        //Creating new link node.
        var link = document.createElement('a');
        link.href = sUrl;

        if (link.download !== undefined){
            //Set HTML5 download attribute. This will prevent file from opening if supported.
            var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
            link.download = fileName;
        }

        //Dispatching click event.
        if (document.createEvent) {
            var e = document.createEvent('MouseEvents');
            e.initEvent('click' ,true ,true);
            link.dispatchEvent(e);
            return true;
        }
    }

    // Force file download (whether supported by server).
    var query = '?download';

    window.open(sUrl + query);
}

window.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') &gt; -1;
window.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') &gt; -1;