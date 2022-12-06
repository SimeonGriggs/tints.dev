/* eslint-disable max-nested-callbacks */
/// <reference types="cypress" />

/* global expect, cy, it, describe, beforeEach */
import {META} from '../../app/lib/constants'
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

  it('has the default title on `/` page load', () => {
    cy.get('article').should('have.length', 1)
    cy.location('search').should('be.empty')
    cy.title().should('eq', META.title)
    cy.get('meta[property="og:title"]').invoke('attr', 'content').should('eq', META.title)
    cy.get('meta[name="twitter:title"]').invoke('attr', 'content').should('eq', META.title)
    cy.get('meta[property="og:image"]').invoke('attr', 'content').should('not.be.empty')
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
      .then((val) => cy.get('meta[name="theme-color"]').should('have.attr', 'content', `#${val}`))
  })

  it('updates the picker when a new value is typed', () => {
    cy.get('article').first().find('input[name="value"]').clear().type('ff0000').blur()
    cy.get('article').first().find('#headlessui-popover-button-1').click()
    cy.get('.react-colorful__saturation').should(
      'have.attr',
      'style',
      'background-color: rgb(255, 0, 0);'
    )
  })

  it('updates the `value` field when the picker is used, and closes picker on button press', () => {
    const inputColor = `ace975`
    cy.get('article').first().find('input[name="value"]').clear().type(inputColor).blur()
    cy.get('article').first().find('#headlessui-popover-button-1').click()
    cy.wait(100)
    cy.get('article input[name="value"]')
      .first()
      .invoke('val')
      .then((val1) => {
        // Field value is what we typed
        expect(val1).to.equal(inputColor.toUpperCase())

        // Use picker to set new value
        cy.get('article').first().find('.react-colorful__saturation').click({x: 100, y: 100})
        cy.wait(500)

        // Field value should be updated
        cy.get('article input[name="value"]')
          .first()
          .invoke('val')
          .then((val2) => {
            expect(val2).not.to.equal(inputColor.toUpperCase())
            expect(val2).not.to.equal(val1.toUpperCase())
          })
      })

    cy.get('article').first().find('#closePicker').click()
    cy.get('article').first().find('.react-colorful').should('not.exist')
  })
})
