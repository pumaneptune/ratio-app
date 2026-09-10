import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import React from 'react';
import HomePage from './pages/HomePage';

export function render(url: string) {
  return renderToString(
    React.createElement(StaticRouter, { location: url }, React.createElement(HomePage)),
  );
}
