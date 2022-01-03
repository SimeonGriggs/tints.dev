/// <reference types="cypress" />
/* global Cypress, cy, it, describe, beforeEach */

import {titleCase} from '../../app/lib/helpers'

describe('general tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('displays one palette by default', () => {
    cy.get('article').should('have.length', 1)
  })

  it('has a pretty url with only one palette', () => {
    cy.get('article').should('have.length', 1)
    cy.location('search').should('be.empty')
    cy.location('pathname').should('not.equal', '/')
  })

  it('adds one palette when "add" clicked', () => {
    cy.get('#add-button').click().get('article').should('have.length', 2)
  })

  it('has search params url with more than one palette', () => {
    cy.get('#add-button').click().get('article').should('have.length', 2)
    cy.location('search').should('not.be.empty')
    cy.location('pathname').should('equal', '/')
  })

  it('has correctly updated search params with more than one palette', () => {
    cy.get('#add-button').click().get('article').should('have.length', 2)
    cy.get('article').first().find('input[name="name"]').clear().type('greenish')
    cy.get('article').first().find('input[name="value"]').clear().type('ace975')
    cy.location('search').should('contain', 'greenish=ACE975')
    cy.location('pathname').should('equal', '/')
  })

  // it('did not update back button when name changed', () => {
  //   cy.get('article').first().find('input[name="name"]').clear().type('blueish')
  //   history.should('have.length', 1)
  // })

  it('updated back button when value changed', () => {
    cy.get('#add-button').click().get('article').should('have.length', 2)
    cy.get('article').first().find('input[name="value"]').clear().type('ff00cc')
    cy.location('search').should('contain', '=FF00CC')
    cy.go('back')
    cy.location('search').should('not.contain', '=FF00CC')
  })

  it('removes one palette when "delete" clicked', () => {
    cy.get('#add-button').click().get('article').should('have.length', 2)
    cy.get('[data-test="paletteDelete"]').first().click().get('article').should('have.length', 1)
  })

  it('meta tags reflect current first palette', () => {
    cy.get('#add-button').click().click().get('article').should('have.length', 3)
    cy.get('[data-test="paletteDelete"]').first().click().get('article').should('have.length', 2)

    cy.get('article input[name="name"]')
      .first()
      .invoke('val')
      .then((name) => {
        const titleStartsWith = new RegExp(`^${titleCase(name)}`)

        cy.get('title').invoke('text').should('match', titleStartsWith)
        cy.get('meta[property="og:title"]')
          .invoke('attr', 'content')
          .should('match', titleStartsWith)
        cy.get('meta[name="twitter:title"]')
          .invoke('attr', 'content')
          .should('match', titleStartsWith)
      })

    cy.get('article input[name="value"]')
      .first()
      .invoke('val')
      .then((val) => {
        cy.log(val)

        cy.get('meta[name="theme-color"]').should('have.attr', 'content', `#${val}`)
      })
  })
})
