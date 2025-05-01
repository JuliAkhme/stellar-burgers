import * as orderFixture from '../../fixtures/order.json';

const INGREDIENT_BUN = '[data-ingredient="bun"]';
const INGREDIENT_OTHER = '[data-ingredient="main"],[data-ingredient="sauce"]';
const MODALS = '#modals';
const ORDER_BUTTON = '[data-order-button]';

describe('Тест конструктора бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
    cy.visit('/');
  });

  it('Тест добавления ингредиента в конструктор', () => {
    cy.get(INGREDIENT_BUN).should('have.length.at.least', 1);
    cy.get(INGREDIENT_OTHER).should('have.length.at.least', 1);
  });

  describe('Тест работы модального окна', () => {
    describe('Открытие модального окна', () => {
      it('Клик по карточке ингредиента', () => {
        cy.get(`${INGREDIENT_BUN}:first-of-type`).click();
        cy.get(MODALS).children().should('have.length', 2);
      });

      it('Открытое состояние модального окна после перезагрузки страницы', () => {
        cy.get(`${INGREDIENT_BUN}:first-of-type`).click();
        cy.reload(true);
        cy.get(MODALS).children().should('have.length', 2);
      });
    });

    describe('Закрытие модального окна', () => {
      it('Клик на крестик', () => {
        cy.get(`${INGREDIENT_BUN}:first-of-type`).click();
        cy.get(`${MODALS} button:first-of-type`).click();
        cy.wait(500);
        cy.get(MODALS).children().should('have.length', 0);
      });

      it('Клик на оверлей', () => {
        cy.get(`${INGREDIENT_BUN}:first-of-type`).click();
        cy.get(`${MODALS}>div:nth-of-type(2)`).click({ force: true });
        cy.wait(500);
        cy.get(MODALS).children().should('have.length', 0);
      });

      it('Клик на Esc', () => {
        cy.get(`${INGREDIENT_BUN}:first-of-type`).click();
        cy.get('body').type('{esc}');
        cy.wait(500);
        cy.get(MODALS).children().should('have.length', 0);
      });
    });
  });

  describe('Тест создания заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');

      cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
      cy.intercept('POST', 'api/orders', { fixture: 'order' });
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });

      cy.visit('/');
    });

    it('Оформление заказа авторизованным пользователем', () => {
      cy.get(ORDER_BUTTON).should('be.disabled');
      cy.get(`${INGREDIENT_BUN}:first-of-type button`).click();
      cy.get(ORDER_BUTTON).should('be.disabled');
      cy.get('[data-ingredient="main"]:first-of-type button').click();
      cy.get(ORDER_BUTTON).should('be.enabled');

      cy.get(ORDER_BUTTON).click();

      cy.get(MODALS).children().should('have.length', 2);

      cy.get(MODALS + ' h2:first-of-type').should(
        'have.text',
        orderFixture.order.number
      );

      cy.get(ORDER_BUTTON).should('be.disabled');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});