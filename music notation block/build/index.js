wp.blocks.registerBlockType('music-notation-block/main', {
    title: 'Music Notation',
    icon: {
        src: wp.element.createElement('svg', { 
            viewBox: '0 0 24 24',
            width: 24,
            height: 24
        }, 
            wp.element.createElement('path', {
                d: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
                fill: 'currentColor'
            })
        ),
        foreground: '#1e1e1e'
    },
    category: 'common',
    attributes: {
        notation: {
            type: 'string',
            default: 'X:1\nT:Example\nM:4/4\nL:1/4\nK:C\nCDEF|GABc|'
        },
        scale: { type: 'number', default: 1.2 },
        width: { type: 'number', default: 800 },
        backgroundColor: { type: 'string', default: '#ffffff' },
        borderColor: { type: 'string', default: '#dddddd' },
        borderWidth: { type: 'number', default: 1 },
        borderRadius: { type: 'number', default: 0 },
        padding: { type: 'number', default: 0 }
    },

    edit: ({ attributes, setAttributes }) => {
        const renderMusic = (container) => {
            if (!container || !window.ABCJS) return;
            container.innerHTML = '';
            try {
                ABCJS.renderAbc(container, attributes.notation, {
                    scale: attributes.scale,
                    staffwidth: attributes.width
                });
            } catch (e) {
                console.error('ABC Render Error:', e);
            }
        };

        const containerStyle = {
            backgroundColor: attributes.backgroundColor,
            borderColor: attributes.borderColor,
            borderWidth: attributes.borderWidth + 'px',
            borderStyle: 'solid',
            borderRadius: attributes.borderRadius + 'px',
            padding: attributes.padding + 'px'
        };

        return wp.element.createElement('div', null, [
            wp.element.createElement(wp.blockEditor.InspectorControls, null,
                wp.element.createElement(wp.components.PanelBody, { title: 'Style Settings' }, [
                    wp.element.createElement('div', { style: { marginBottom: '20px' } },
                        wp.element.createElement('label', null, 'Background Color'),
                        wp.element.createElement(wp.components.ColorPicker, {
                            color: attributes.backgroundColor,
                            onChangeComplete: (color) => setAttributes({ backgroundColor: color.hex })
                        })
                    ),
                    wp.element.createElement('div', { style: { marginBottom: '20px' } },
                        wp.element.createElement('label', null, 'Border Color'),
                        wp.element.createElement(wp.components.ColorPicker, {
                            color: attributes.borderColor,
                            onChangeComplete: (color) => setAttributes({ borderColor: color.hex })
                        })
                    ),
                    wp.element.createElement(wp.components.RangeControl, {
                        label: 'Staff Width',
                        value: attributes.width,
                        onChange: (value) => setAttributes({ width: value }),
                        min: 300,
                        max: 1200,
                        step: 50
                    }),
                    wp.element.createElement(wp.components.RangeControl, {
                        label: 'Border Width',
                        value: attributes.borderWidth,
                        onChange: (value) => setAttributes({ borderWidth: value }),
                        min: 0,
                        max: 10
                    }),
                    wp.element.createElement(wp.components.RangeControl, {
                        label: 'Border Radius',
                        value: attributes.borderRadius,
                        onChange: (value) => setAttributes({ borderRadius: value }),
                        min: 0,
                        max: 20
                    }),
                    wp.element.createElement(wp.components.RangeControl, {
                        label: 'Padding',
                        value: attributes.padding,
                        onChange: (value) => setAttributes({ padding: value }),
                        min: 0,
                        max: 50
                    }),
                    wp.element.createElement(wp.components.RangeControl, {
                        label: 'Scale',
                        value: attributes.scale,
                        onChange: (value) => setAttributes({ scale: value }),
                        min: 0.5,
                        max: 2,
                        step: 0.1
                    })
                ])
            ),
            wp.element.createElement(wp.components.TextareaControl, {
                label: 'ABC Notation',
                help: 'Enter ABC notation for your music score',
                value: attributes.notation,
                onChange: (value) => setAttributes({ notation: value }),
                rows: 8
            }),
            wp.element.createElement('div', { 
                ref: renderMusic,
                style: containerStyle
            })
        ]);
    },

    save: ({ attributes }) => {
        const style = {
            backgroundColor: attributes.backgroundColor,
            borderColor: attributes.borderColor,
            borderWidth: attributes.borderWidth + 'px',
            borderStyle: 'solid',
            borderRadius: attributes.borderRadius + 'px',
            padding: attributes.padding + 'px'
        };

        return wp.element.createElement('div', {
            className: 'music-notation',
            'data-notation': attributes.notation,
            'data-scale': attributes.scale,
            'data-width': attributes.width,
            style: style
        });
    }
});