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


    self.refreshPanel = function() {
        self.$editor.html('');
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

