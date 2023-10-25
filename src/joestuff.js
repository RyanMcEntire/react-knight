// utility class, could be a function, but in keeping with the class stuff, it is what it is.
class ElementFactory {
  static create(properties) {
    const elem = document.createElement(properties.element);
    for (let i in properties) {
      elem[i] = properties[i];
    }
    return elem;
  }
}

// just fetches data
async function fetchData(url) {
  try {
    let response = await fetch(url);
    let results = await response.json();
    return results;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

class DataHandler {
  constructor() {
    this.data = {};
  }

  loadData(data) {
    this.data = data;
  }

  getSelectors() {
    return this.data.selectors;
  }

  getHomeData() {
    return this.data.home;
  }

  // other methods to get other data like Experience, Certifications, etc.
}

class ContentSetter {
  constructor(dataHandler) {
    this.dataHandler = dataHandler;
    this.currentSelector;
  }

  setPage() {
    switch (this.currentSelector) {
      case 'Home':
        this.setHome();
        break;
      case 'Skills':
        this.setSkills();
        break;
      case 'Certs':
        this.setCerts();
        break;
      case 'Xp':
        this.setXp();
        break;
      default:
        console.log('weird selector', this.currentSelector);
        break;
      // ... others
    }
  }

  clearContent() {
    //clears the content section
    // can clear the children of the node or element you're appending to
  }

  setHome() {
    this.clearContent();

    const home = ElementFactory.create({
      element: 'div',
      className: 'home',
    });

    const statement = ElementFactory.create({
      element: 'div',
      className: 'statement',
      textContent: this.dataHandler.getHomeData(),
    });

    home.appendChild(statement);
    document.querySelector('.wherever-you-append-shit').appendChild(home);
  }

  setSkills() {
    // looks the same as setHome, but for your skill section.
    // iterate through each of your skills
    const skillsSection = ElementFactory.create({
      element: 'div',
      className: 'skills-section',
    });

    const skills = this.dataHandler.getSkills();
    skills.forEach((skill) => {
      const skillElement = ElementFactory.create({
        element: 'div',
        className: 'skill',
        textContent: skill,
      });
      skillsSection.appendChild(skillElement);
    });
    document
      .querySelector('wherever-you-append-shit')
      .appendChild(skillsSection);
  }
}

class SelectorManager {
  constructor(dataHandler, contentSetter) {
    this.dataHandler = dataHandler;
    this.contentSetter = contentSetter;
  }

  setSelectors() {
    const selectors = this.dataHandler.getSelectors();
    selectors.forEach((item) => {
      const li = ElementFactory.create({
        element: 'li',
        id: item,
        textContent: item,
      });
      li.addEventListener('click', (e) => {
        this.contentSetter.currentSelector = e.target.id;
        this.contentSetter.setPage();
      });
      document.querySelector('.sidebar .buttons').appendChild(li);
    });
  }
}

async function initUI() {
  // Fetch data from JSON
  const url = 'path/to/your/data.json';
  const fetchedData = await fetchData(url);

  const dataHandler = new DataHandler();
  dataHandler.loadData(fetchedData);

  const contentSetter = new ContentSetter(dataHandler);
  const selectorManager = new SelectorManager(dataHandler, contentSetter);

  selectorManager.setSelectors();
}

// Call initUI
initUI();

// funny one liner
