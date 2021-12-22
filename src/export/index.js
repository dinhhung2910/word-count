/* eslint-disable max-len */
const xl = require('excel4node');
const Request = require('../../models/Request');
const Link = require('../../models/Link');

const newWorkbook = () => {
  const wb = new xl.Workbook({
    jszip: {
      compression: 'DEFLATE',
    },
    defaultFont: {
      size: 12,
      name: 'Calibri',
      color: '000000',
    },
    dateFormat: 'd/m/yy hh:mm:ss',
    workbookView: {
      activeTab: 1, // Specifies an unsignedInt that contains the index to the active sheet in this book view.
      autoFilterDateGrouping: true, // Specifies a boolean value that indicates whether to group dates when presenting the user with filtering options in the user interface.
      firstSheet: 1, // Specifies the index to the first sheet in this book view.
      minimized: false, // Specifies a boolean value that indicates whether the workbook window is minimized.
      showHorizontalScroll: true, // Specifies a boolean value that indicates whether to display the horizontal scroll bar in the user interface.
      showSheetTabs: true, // Specifies a boolean value that indicates whether to display the sheet tabs in the user interface.
      showVerticalScroll: true, // Specifies a boolean value that indicates whether to display the vertical scroll bar.
      tabRatio: 600, // Specifies ratio between the workbook tabs bar and the horizontal scroll bar.
      visibility: 'visible', // Specifies visible state of the workbook window. ('hidden', 'veryHidden', 'visible') (§18.18.89)
      windowHeight: 17620, // Specifies the height of the workbook window. The unit of measurement for this value is twips.
      windowWidth: 28800, // Specifies the width of the workbook window. The unit of measurement for this value is twips..
      xWindow: 0, // Specifies the X coordinate for the upper left corner of the workbook window. The unit of measurement for this value is twips.
      yWindow: 440, // Specifies the Y coordinate for the upper left corner of the workbook window. The unit of measurement for this value is twips.
    },
    logLevel: 0, // 0 - 5. 0 suppresses all logs, 1 shows errors only, 5 is for debugging
    author: 'GTE Localize', // Name for use in features such as comments
  });
  return wb;
};

const exportRequest = async (requestId) => {
  const request = await Request.findById(requestId);
  const links = await Link.find({requestId}).lean();

  const wb = newWorkbook();

  const ws = wb.addWorksheet('Sheet 1');

  // Create a reusable style
  const style = wb.createStyle({
    font: {
      color: '#000000',
      size: 12,
    },
  });

  if (!request) {
    return wb;
  }

  // Set value of cell A1 to 100 as a number type styled with paramaters of style
  ws.cell(1, 1)
    .string('Home page: ')
    .style(style);
  ws.cell(1, 2)
    .string(request.home)
    .style(style);

  ws.cell(2, 1)
    .string('Total pages crawled: ')
    .style(style);
  ws.cell(2, 2)
    .number(request.totalLink)
    .style(style);

  ws.cell(3, 1)
    .string('Total words crawled: ')
    .style(style);
  ws.cell(3, 2)
    .number(request.totalWord)
    .style(style);

  let line = 6;
  ws.cell(5, 1)
    .string('Link')
    .style(style);
  ws.cell(6, 1)
    .string('Words')
    .style(style);

  for (const link of links) {
    ws.cell(line, 1)
      .string(link.url)
      .style(style);
    ws.cell(line, 2)
      .number(link.wordCount)
      .style(style);
    line++;
  }

  return wb;
};

module.exports = {exportRequest};
