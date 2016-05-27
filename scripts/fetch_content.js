require('dotenv').config();
var _ = require('lodash');
var fs = require('fs');
var mkdirp = require('mkdirp');
var contentfulStatic = require('contentful-static');
var PATH = 'contents';
const defaultLang = 'en-GB';

function generateLocalPagesContent(pages, path, lang){
  _.each(pages, function(page){
    page = page.fields;

    var folderPath = `${path}/${_.kebabCase(page.title)}`;
    var mdFolderPath = `${folderPath}/_index`;
    mkdirp.sync(folderPath);
    mkdirp.sync(mdFolderPath);

    fs.writeFileSync(`${mdFolderPath}/content.markdown`, page.content, 'UTF-8');
    if (page.more) {
      fs.writeFileSync(`${mdFolderPath}/more.markdown`, page.more, 'UTF-8');
    }
    delete page.content;
    delete page.more;

    page.lang = lang.split('-')[0] || lang;
    page.langCode = lang;
    fs.writeFileSync(`${folderPath}/index.json`, JSON.stringify(page, null, 2), 'UTF-8');
  })
}

function generateLocalSectionsContent(sections, path){
  _.each(sections, function(section){
    section = section.fields;
    var folderPath = `${path}/_shared`

    mkdirp.sync(folderPath);
    var title = _.kebabCase(section.title);
    fs.writeFileSync(`${folderPath}/${title}.markdown`, section.content, 'UTF-8');
  })
}

function sync(space, accessToken){
  contentfulStatic.config({
    space: space,
    accessToken: accessToken
  });

  contentfulStatic.sync(function(err, json) {
      if(err) {
          console.log('contentful-static: data could not be fetched');
          return false;
      }

      var languages = Object.keys(json.entries);
      
      languages.forEach((lang) => {
        var content = json.entries[lang];
        var pages = _.filter(content, function(entry){
          return entry.sys.contentType.sys.id === 'page'
        });
        var sections = _.filter(content, function(entry){
          return entry.sys.contentType.sys.id === 'section'
        });

        const path = `${PATH}${(lang === defaultLang) ? '' : `/${lang}`}`;
        generateLocalPagesContent(pages, path, lang);
        generateLocalSectionsContent(sections, path, lang);
      })
  });
}

sync(
  process.env.CONTENTFUL_SPACE,
  process.env.CONTENTFUL_KEY
)
