let temp_data = [];
let organizations;
d3.json("./data/data.json")
  .then(data => {
          data.forEach(datum => {
            temp_data.push(new Org(datum.name, datum.date, datum.type,
                                    datum.numStaff, datum.lang, datum.freq,
                                    datum.page, datum.platform, datum.other_media,
                                    datum.audience, datum.online_ad, datum.print_ad));
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
          // const mapLanguages = (languageList) => {
          //   let uniqueList = [];
          //   for(var i = 0; i < languageList.length; i++) {
          //     for(var j = 0; j < languageList[i].length; j++) {
          //       !uniqueList.includes(languageList[i][j]) ? uniqueList.push(languageList[i][j]) : false;
          //     }
          //   }
          //   return uniqueList;
          // }
          // const languages = mapLanguages([...new Set(organizations_data.map(item => item.lang))]);

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

           let dimension_page = organizations.dimension(item => item.name);
           let count_page = dimension_page.group().reduceSum(d => d.page);

           dc.rowChart('#row_page')
              .width(600)
              .height(300)
              .x(d3.scaleBand())
              .elasticX(true)
              .dimension(dimension_page)
              .group(count_page)
              .render();

          /**
           * Number of staffs in an organization
           */

          let dimension_numStaff = organizations.dimension(item => item.name);
          let count_numStaff = dimension_numStaff.group().reduceSum(d => d.numStaff);

          dc.barChart('#bar_staff')
              .width(600)
              .height(300)
              .x(d3.scaleBand())
              .xUnits(dc.units.ordinal)
              .dimension(dimension_numStaff)
              .group(count_numStaff)
              .elasticY(true)
              .barPadding(0.1)
              // .centerBar(true)
              // .x(d3.scaleLinear().domain([0, 30]))
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
           * Audiences per issue
           */

         let dimension_audience = organizations.dimension(item => item.name);
         let group_audience = dimension_audience.group().reduceSum(d => d.audience);

         dc.barChart('#bar_audience')
            .width(600)
            .height(400)
            .margins({top: 10, right: 10, bottom: 20, left: 40})
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .elasticY(true)
            .dimension(dimension_audience)
            .barPadding(0.1)
            .group(group_audience)
            .render();

          /**
           * Online Advertising
           */

          let dimension_online_ad = organizations.dimension(item => item.online_ad);
          let group_online_ad = dimension_online_ad.group();

          dc.pieChart('#dough_online_ad')
              .width(300)
              .height(300)
              .innerRadius(50)
              .dimension(dimension_online_ad)
              .group(group_online_ad)
              .render();

          /**
          * Print Advertising
          */

          let dimension_print_ad = organizations.dimension(item => item.print_ad);
          let group_print_ad = dimension_print_ad.group();

          dc.pieChart('#dough_print_ad')
              .width(300)
              .height(300)
              .innerRadius(50)
              .dimension(dimension_print_ad)
              .group(group_print_ad)
              .render();

        },
        () => console.log('Error'));


function Org( name, date, type,
              numStaff, lang, freq,
              page, platform, other_media,
              audience, online_ad, print_ad) {
  this.name = name;
  this.date = new Date(date);
  this.type = type;
  this.numStaff = numStaff;
  this.lang = lang.split(',');
  this.freq = freq;
  this.page = page;
  this.platform = platform.split(',');
  this.other_media = other_media.split(',');
  this.audience = audience;
  this.online_ad = online_ad;
  this.print_ad = print_ad;
};
