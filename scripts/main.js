let temp_data = [];
let organizations;
d3.json("./data/data.json")
  .then(data => {
          data.forEach(function(datum) {
            temp_data.push(new Org(datum.name, datum.date, datum.type,
                                    datum.numStaff, datum.lang, datum.freq,
                                    datum.page, datum.platform, datum.other_media));
          });

          organizations = crossfilter(temp_data);
          
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
              // .label(d => d.key + ': ' + d.value)
              .dimension(dimension_type)
              .group(count_type);
          dough_type.render();

          /**
           * Languages
           */

          // This method maps the languages as a single array of unique values
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

          var dimension_lang = organizations.dimension(item => item.lang, true);
          let group_lang = dimension_lang.group();

          dc.pieChart('#dough_lang')
              .width(300)
              .height(300)
              .innerRadius(50)
              .dimension(dimension_lang)
              .group(group_lang)
              .render();

          /**
           * Frequency of publication
           */

          let dimension_freq = organizations.dimension(item => item.freq);
          let count_freq = dimension_freq.group().reduceCount(item => item.freq);

          dc.pieChart('#dough_freq')
              .width(300)
              .height(300)
              .innerRadius(50)
              .dimension(dimension_freq)
              .group(count_freq)
              .render();

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

          /**
           * Content Platforms
           */

          let dimension_platform = organizations.dimension(item => item.platform, true);
          let group_platform = dimension_platform.group();

          dc.pieChart('#dough_platform')
              .width(300)
              .height(300)
              .innerRadius(50)
              .dimension(dimension_platform)
              .group(group_platform)
              .render();

          /**
           * Production for other media
           */

          let dimension_other_media = organizations.dimension(item => item.other_media, true);
          let group_other_media = dimension_other_media.group();

          dc.pieChart('#dough_other_media')
              .width(300)
              .height(300)
              .innerRadius(50)
              .dimension(dimension_other_media)
              .group(group_other_media)
              .render();

          /**
           * Location
           */

          // let dimension_platform = organizations.dimension(item => item.platform, true);
          // let group_platform = dimension_platform.group();
          //
          // dc.pieChart('#dough_platform')
          //     .width(300)
          //     .height(300)
          //     .innerRadius(50)
          //     .dimension(dimension_platform)
          //     .group(group_platform)
          //     .render();

        },
        () => console.log('Error'));

function Org( name, date, type,
              numStaff, lang, freq,
              page, platform, other_media) {
  this.name = name;
  this.date = new Date(date);
  this.type = type;
  this.numStaff = numStaff;
  this.lang = lang.split(',');
  this.freq = freq;
  this.page = page;
  this.platform = platform.split(',');
  this.other_media = other_media.split(',');
};

let organizations_data =
[
  {
    name: 'The Hakha Post',
    type: 'private',
    lang: ["Hakha"],
    freq: '5 times a week',
    page: 4,
    date: new Date('2012-01'),
    numStaff: 24,
    platform: ['Online', 'Video', 'Print'],
    other_media: ['Video', 'Print'],
  },
  {
    name: 'Myitkyina News Journal',
    type: 'private',
    lang: ["Myanmar"],
    freq: 'weekly',
    page: 20,
    date: new Date('2014-03'),
    numStaff: 23,
    platform: ['Online', 'Video', 'Audio', 'Print'],
    other_media: ['Video', 'Audio', 'Print'],
  },
  {
    name: 'The Voice of Shanni',
    type: 'ngo',
    lang: ["Myanmar", "Shanni"],
    freq: 'monthly',
    page: 40,
    date: new Date('2014-07'),
    numStaff: 15,
    platform: ['Online', 'Video', 'Print'],
    other_media: ['Video', 'Photo', 'Print', 'Online Text'],
  }
];

// let organizations = crossfilter(organizations_data);
