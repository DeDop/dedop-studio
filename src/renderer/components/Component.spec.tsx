import * as React from 'react';
import {expect} from 'chai';
import {shallow, configure} from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

import {HGLContainer, HGLHeader, HGLCenter, HGLFooter} from './Components';

configure({adapter: new Adapter()});

describe('Main containers tests', () => {
    it('renders <HGLContainer /> components', () => {
        const wrapper = shallow(
            <HGLContainer>
                <HGLHeader/>
                <HGLCenter/>
                <HGLFooter/>
            </HGLContainer>);
        expect(wrapper.find('.hgl-container'), ' expect .hgl-container to be called 1 time').to.have.length(1);
        expect(wrapper.find('div'), 'expect to have 1 div element').to.have.length(1);
        expect(wrapper.contains(
            <div className="hgl-container">
                <HGLHeader/>
                <HGLCenter/>
                <HGLFooter/>
            </div>), 'the html elements are not as expected')
            .to.equal(true);
        expect(wrapper.containsAllMatchingElements([<HGLHeader/>, <HGLCenter/>, <HGLFooter/>]),
               'expect <HGLHeader/>, <HGLCenter/>, <HGLFooter/>').to.equal(true);
    });

    it('renders <HGLHeader /> components', () => {
        const wrapper = shallow(<HGLHeader/>);
        expect(wrapper.find('.hgl-header'), '.hgl-header class is expected tobe called 1 time').to.have.length(1);
        expect(wrapper.find('div'), 'expected to have 1 div element').to.have.length(1);
        expect(wrapper.contains(<div className="hgl-header"/>)).to.equal(true);
    });

    it('renders <HGLCenter /> components', () => {
        const wrapper = shallow(<HGLCenter/>);
        expect(wrapper.find('.hgl-center'), '.hgl-center class is expected tobe called 1 time').to.have.length(1);
        expect(wrapper.find('div'), 'expected to have 1 div element').to.have.length(1);
        expect(wrapper.contains(<div className="hgl-center"/>)).to.equal(true);
    });

    it('renders <HGLFooter /> components', () => {
        const wrapper = shallow(<HGLFooter/>);
        expect(wrapper.find('.hgl-footer'), '.hgl-footer class is expected tobe called 1 time').to.have.length(1);
        expect(wrapper.find('div'), 'expected to have 1 div element').to.have.length(1);
        expect(wrapper.contains(<div className="hgl-footer"/>)).to.equal(true);
    });
});
