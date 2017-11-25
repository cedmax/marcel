require('dotenv').config();
const _ = require('lodash');
const fs = require('fs');
const mkdirp = require('mkdirp');
const contentfulStatic = require('contentful-static');
const PATH = 'contents';
const defaultLang = 'en-GB';

function generateLocalPagesContent(pages, path, lang){
  _.each(pages, (page) => {
    page = page.fields;

    const folderPath = `${path}/${_.kebabCase(page.title)}`;
    const mdFolderPath = `${folderPath}/_index`;
    mkdirp.sync(folderPath);
    mkdirp.sync(mdFolderPath);

    fs.writeFileSync(`${mdFolderPath}/content.markdown`, page.content, 'UTF-8');
    if (page.more) {
      fs.writeFileSync(`${mdFolderPath}/more.markdown`, page.more, 'UTF-8');
    }
    delete page.content;
    delete page.more;

    page.lang = (lang ===defaultLang) ? '' : lang;
    page.langCode = lang;
    fs.writeFileSync(`${folderPath}/index.json`, JSON.stringify(page, null, 2), 'UTF-8');
  })
}

function generateLocalSectionsContent(sections, path){
  _.each(sections, (section) => {
    section = section.fields;
    const folderPath = `${path}/_shared`

    mkdirp.sync(folderPath);
    const title = _.kebabCase(section.title);
    fs.writeFileSync(`${folderPath}/${title}.markdown`, section.content, 'UTF-8');
  })
}

function sync(space, accessToken){
  contentfulStatic.config({
    space: space,
    accessToken: accessToken
  });

  contentfulStatic.sync((err, json) => {
      if(err) {
          console.log('contentful-static: data could not be fetched');
          return false;
      }

      const languages = Object.keys(json.entries);
      
      languages.forEach((lang) => {
        const content = json.entries[lang];
        const pages = _.filter(content, function(entry){
          return entry.sys.contentType.sys.id === 'page'
        });
        const sections = _.filter(content, function(entry){
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
