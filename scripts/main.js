const organizations_data =
[
  {
    name: 'The Hakha Post',
    type: 'private',
    lang: ['Hakha'],
    freq: '5 times a week',
    page: 4,
    date: new Date('2012-01'),
    numStaff: 24
  },
  {
    name: 'Myitkyina News Journal',
    type: 'private',
    lang: ['Myanmar'],
    freq: 'weekly',
    page: 20,
    date: new Date('2014-03'),
    numStaff: 23
  },
  {
    name: 'The Voice of Shanni',
    type: 'ngo',
    lang: ['Myanmar', 'Shanni'],
    freq: 'monthly',
    page: 40,
    date: new Date('2014-07'),
    numStaff: 15
  }
];

let organizations = crossfilter(organizations_data);

/**
 * Organization chart
 */

let dimension_org = organizations.dimension(item => item.name);
let group_org = dimension_org.group();

dc.rowChart('#row_org')
    .width(500)
    .height(500)
    .dimension(dimension_org)
    .group(group_org)
    .render();

/**
 * Date founded
 */

let dimension_date = organizations.dimension(item => item.date);
let group_date = dimension_date.group();

dc.lineChart('#area_date')
  .renderArea(true)
  .width(600)
  .height(300)
  .transitionDuration(1000)
  .dimension(dimension_date)
  .mouseZoomable(true)
  .x(d3.scaleTime().domain([new Date('1991-11'), new Date('2017-09')]))
  .group(group_date)
  .render();

/**
 * Type of organizations
 */

let dimension_type = organizations.dimension(item => item.type);
let count_type = dimension_type.group().reduceCount(item => item.type);

let dough_type = dc.pieChart('#dough_type');
dough_type
    .width(300)
    .height(300)
    .innerRadius(50)
    .label(d => d.key + ': ' + d.value)
    .dimension(dimension_type)
    .group(count_type);
dough_type.render();

/**
 * Languages
 */

const mapLanguages = (languageList) => {
  let uniqueList = [];
  for(var i = 0; i < languageList.length; i++) {
    for(var j = 0; j < languageList[i].length; j++) {
      !uniqueList.includes(languageList[i][j]) ? uniqueList.push(languageList[i][j]) : false;
    }
  }
  return uniqueList;
}
const languages = mapLanguages([...new Set(organizations_data.map(item => item.lang))]);

let dimension_lang = organizations.dimension(item => item.lang);
let count_lang = dimension_lang.group().reduceCount(item => item.lang); // TODO: Check against the language array

let dough_lang = dc.pieChart('#dough_lang');
dough_lang
    .width(300)
    .height(300)
    .innerRadius(50)
    .label(d => d.key + ': ' + d.value)
    .dimension(dimension_lang)
    .group(count_lang);
dough_lang.render();

/**
 * Frequency of publication
 */

let dimension_freq = organizations.dimension(item => item.freq);
let count_freq = dimension_freq.group().reduceCount(item => item.freq);

let dough_freq = dc.pieChart('#dough_freq');
dough_freq
    .width(300)
    .height(300)
    .innerRadius(50)
    .label(d => d.key + ': ' + d.value)
    .dimension(dimension_freq)
    .group(count_freq);
dough_freq.render();

/**
 * Number of pages of publication
 */

 let dimension_page = organizations.dimension(item => item.page);
 let count_page = dimension_page.group();

 dc.rowChart('#row_page')
    .width(500)
    .height(300)
    .x(d3.scaleLinear().domain([0, 75]).range([0, 480]))
    .elasticX(true)
    .dimension(dimension_page)
    .group(count_page)
    .render();

/**
 * Number of staffs in an organization
 */

let dimension_numStaff = organizations.dimension(item => item.numStaff);
let count_numStaff = dimension_numStaff.group();

dc.barChart('#bar_staff')
    .width(600)
    .height(300)
    .dimension(dimension_numStaff)
    .group(count_numStaff)
    .elasticY(true)
    .centerBar(true)
    .x(d3.scaleLinear().domain([0, 30]))
    .render();
