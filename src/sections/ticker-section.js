import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { InputGroup, Card, Button } from '@blueprintjs/core';

// import { urlToBase64, svgToURL } from 'polotno/utils/svg';
import { SectionTab } from 'polotno/side-panel';
import { getKey } from 'polotno/utils/validate-key';
// import { getImageSize } from 'polotno/utils/image';
import FdCommentQuotes from '@meronex/icons/fd/FdCommentQuotes';
import { getAPI } from 'polotno/utils/api';
import './html-element';
import { ColorPicker, Select, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { directionOptions, fontOptions, positionOptions, speedOptions, textSizeOptions } from '../options';

// import { ImagesGrid } from 'polotno/side-panel/images-grid';

const KEYWORDS = [
  'Love',
  'Movies',
  'Life',
  'History',
  'War',
  'Political',
  'Time',
  'Music',
  'Sport',
  'Business',
  'Think',
  'Travel',
  'Work',
  'Science',
  'Religions',
  'Money',
  'Funny',
];

export const QuotesPanel = observer(({ store }) => {
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState('');
  const [keywords, setKeywords] = React.useState('');
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    store.loadFont('Atma');
  }, []);

  const timeout = React.useRef();
  const requestQuery = (query) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setQuery(query);
    }, 500);
  };

  React.useEffect(() => {
    let skipResults = false;

    const run = async () => {
      setLoading(true);

      const req = await fetch(
        `${getAPI()}/get-quotes?query=${query}&keywords=${keywords}&KEY=${getKey()}`
      );
      if (!req.ok) {
        setLoading(false);
        setItems([]);
        return;
      }
      const json = await req.json();
      if (skipResults) {
        return;
      }
      setLoading(false);
      setItems(json.data);
    };
    run();
    return () => {
      skipResults = true;
    };
  }, [query, keywords]);

  const [form, setForm] = useState({
    text: 'Welcome to Digisigns',
    textColor: '#ffffff',
    backgroundColor: '#000000',
    size: '18',
    font: 'Inter',
    position: 'marquee',
    direction: 'left',
    speed: '5',
  });

  const handleAddTicker = () => {
    const marqueeHtml = `<!DOCTYPEhtml><htmllang="en"><head><metacharset="UTF-8"><meta name="viewport"content="width=device-width,initial-scale=1.0"></head><body><div style="width:100%;height:8rem;background-color:${
        form.backgroundColor
    };display:flex;align-items:center;justify-content:center;overflow:hidden;"><marquee direction=${
        form.direction
    } scrollAmount=${form.speed} style="color:${form.textColor};font-size:${
        form.size + 'px'
    };font-weight:400;font-family:${form.font},sans-serif;">${form.text}</marquee></div></body></html>`;

    const positionedHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><div style="width:100%;height:100;background-color:${form.backgroundColor};display:flex;align-items:center;justify-content:${form.position};overflow:hidden;position:relative;"><h1 style="margin:0;color:${form.textColor};font-size:${form.size}px;margin:1rem;font-weight:400;font-family:${form.font},sans-serif;">${form.text}</h1></div></body></html>`;

    const newText = form.position === 'marquee' ? marqueeHtml : positionedHtml;

    store.activePage.addElement({
      x: 0,
      y: 0,
      type: "html",
      html: newText,
      width: 800,
      height: 150,
    });
  }

  console.log(store.width());

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* <h1 onClick={handleAddTicker}>Hello</h1> */}
      <div style={{ width: '100%', height: '100%', flexDirection: 'column', overflowY: 'auto', display: 'flex' }}>
      <div style={{ flexDirection: 'column', overflowY: 'auto', display: 'flex', alignItems: 'start' }}>
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '16px' }}>
          <Space style={{ flexDirection: 'column', width: '100%', justifyContent: 'start', gap: '1rem', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
              <h1 style={{ fontSize: '1rem', color: '#FFF', fontWeight: 400 }}>Ticker Text</h1>
              <TextArea
                name="text"
                placeholder="Enter Ticker Text"
                style={{ width: '18rem', height: '5rem', resize: 'none', overflowY: 'auto' }}
                value={form.text}
                onChange={handleInputChange}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', width: '18rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <h1 style={{ fontSize: '1rem', color: '#FFF', fontWeight: 400 }}>Text Color</h1>
              <ColorPicker defaultValue="#ffffff" value={form.textColor} size="large" onChange={(value, hex) => handleColorChange('textColor', hex)} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', width: '18rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <h1 style={{ fontSize: '1rem', color: '#FFF', fontWeight: 400 }}>Background Color</h1>
              <ColorPicker defaultValue="#000000" size="large" value={form.backgroundColor} onChange={(value, hex) => handleColorChange('backgroundColor', hex)} />
            </div>
            <div>
              <h1 style={{ fontSize: '1rem', color: '#FFF', fontWeight: 400 }}>Text Size</h1>
              <Select options={textSizeOptions} style={{ width: '18rem', height: '2.8rem', marginTop: '8px' }} value={form.size} onChange={(value) => handleSelectChange('size', value)} />
            </div>
            <div>
              <h1 style={{ fontSize: '1rem', color: '#FFF', fontWeight: 400 }}>Font</h1>
              <Select options={fontOptions} style={{ width: '18rem', height: '2.8rem', marginTop: '8px' }} value={form.font} onChange={(value) => handleSelectChange('font', value)} />
            </div>
            <div>
              <h1 style={{ fontSize: '1rem', color: '#FFF', fontWeight: 400 }}>Position</h1>
              <Select options={positionOptions} style={{ width: '18rem', height: '2.8rem', marginTop: '8px' }} value={form.position} onChange={(value) => handleSelectChange('position', value)} />
            </div>
            {form.position === 'marquee' && (
              <>
                <div>
                  <h1 style={{ fontSize: '1rem', color: '#FFF', fontWeight: 400 }}>Direction</h1>
                  <Select options={directionOptions} style={{ width: '18rem', height: '2.8rem', marginTop: '8px' }} value={form.direction} onChange={(value) => handleSelectChange('direction', value)} />
                </div>
                <div>
                  <h1 style={{ fontSize: '1rem', color: '#FFF', fontWeight: 400 }}>Speed</h1>
                  <Select options={speedOptions} style={{ width: '18rem', height: '2.8rem', marginTop: '8px' }} value={form.speed} onChange={(value) => handleSelectChange('speed', value)} />
                </div>
              </>
            )}
              <Button style={{ backgroundColor: '#454D59', color: '#ffffff', height: '2.8rem', width: '18rem' }} onClick={handleAddTicker}>
                Add
              </Button>
          </Space>
        </div>
      </div>
    </div>
    </div>
  );
});

// define the new custom section
export const TickerSection = {
  name: 'Ticker',
  Tab: (props) => (
    <SectionTab name="Ticker" {...props}>
      <FdCommentQuotes />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: QuotesPanel,
};
