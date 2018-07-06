﻿import * as React from "react"
import { style } from "typestyle"

import "./up.png"

import { getFontClassName, stringIsNullOrEmpty } from "../../../Common/utils/helpers";
import { IconChevron, IconUtilisateur, IconDeconnexion, DirectionEnum } from "../Icons/Icons";


var UP = require("./UP_OneHome.png");
var widthLeftMenu: number | string = 300;
var heightTopBar: number | string = "72px";

function getWidthDroite(): string {
    var tailleBody: number = $("#app").width();

    if (typeof widthLeftMenu === "number") {
        return (tailleBody - widthLeftMenu).toString() + "px";
    }

    var taille: number = parseInt(widthLeftMenu);
    var unite: string = widthLeftMenu.substring(taille.toString().length);

    switch (unite) {
        case "%": 
            return (100 - taille).toString() + "%";

        case "px":
            return (tailleBody - taille).toString() + "px";

        default: 
            return (tailleBody - taille).toString() + "px";
    }
}
function getHeightContent(): string {
    var tailleBody: number = $("#app").height();

    if (typeof heightTopBar === "number") {
        return (tailleBody - heightTopBar).toString() + "px";
    }

    var taille: number = parseInt(heightTopBar);
    var unite: string = heightTopBar.substring(taille.toString().length);

    switch (unite) {
        case "%": 
            return (100 - taille).toString() + "%";

        case "px":
            return (tailleBody - taille).toString() + "px";

        default: 
            return (tailleBody - taille).toString() + "px";
    }
}


export interface UpMenuProps {
    menuItems: MenuItemData[];
    onMenuClick?: (uri: string) => boolean | void;
    onHomeClick?: () => void
    Recherche: JSX.Element;
    Antennes: JSX.Element;
    Utilisateur: string;
    onDeconnexionClick: () => void;
}

export interface UpMenuState {
    selectedBranchId?: string;
}

export default class UpMenuOH extends React.Component<UpMenuProps, UpMenuState> {
    constructor(p, c) {
        super(p, c);
        this.state = {
            selectedBranchId: "",
        };
    }

    render() {
        var styleContenu = style({
            minHeight: 250,
            position: "relative",
            left: widthLeftMenu,
            right: 0,
            width: getWidthDroite(),
            top: 0,
            height: getHeightContent(),
            backgroundColor: "#f5f5f5",
            // padding: "30px 60px",
            // overflow: "auto",
        });

        return <div>
            <LeftMenu selectedBranchId={this.state.selectedBranchId} onBranchClick={this.onBranchClick}
                    onHomeClick={this.props.onHomeClick} menuItems={this.props.menuItems} onMenuClick={this.props.onMenuClick} />
            
            <TopMenu Recherche={this.props.Recherche} Antennes={this.props.Antennes} 
                    Utilisateur={this.props.Utilisateur} onDeconnexionClick={this.props.onDeconnexionClick} />
            
            <div className={styleContenu} >
                {this.props.children}
            </div>
        </div>;
    }

    private onBranchClick = (branchId: string) => {
        this.setState({ selectedBranchId: branchId, });
    }
}


export interface SubMenuProps {
    childMenuItems?: MenuItemData[];
    onMenuClick: (uri: string) => void;
    open: boolean;
    onBranchClick: (branchId: string) => void;
    branchId: string;
    selectedBranchId: string;
    top: boolean;
}

export interface SubMenuState {
}

export class SubMenu extends React.Component<SubMenuProps, SubMenuState>{

    constructor(p, c) {
        super(p, c);
        this.state = {};
    }

    startsWith(str: string, search: string) {
        return str.substr(0, search.length) === search;
    }

    render() {
        if (this.props.childMenuItems == null || this.props.childMenuItems.length == 0) {
            return null;
        }

        var srcMenu = this.props.childMenuItems;

        var lis = srcMenu
            .filter((v) => {
                return v.isVisible === true && v.title != null && v.title.length != 0
            })
            .map((v, i, arr) => {
                var localId = this.props.branchId + i + (v.childMenuItems != null && v.childMenuItems.length != 0 ? "*" : "-");


                return <SubItems
                    sibling={arr}
                    top={this.props.top}
                    icon={v.icon}
                    selectedBranchId={this.props.selectedBranchId}
                    branchId={localId}
                    onBranchClick={this.props.onBranchClick}
                    key={i}
                    open={this.props.open}
                    onMenuClick={this.props.onMenuClick}
                    uri={v.uri} title={v.title}
                    isVisible={v.isVisible}
                    isSelected={v.isSelected}
                    childMenuItems={v.childMenuItems} />
            })


        return <div>
            {lis}
        </div>
    }

    private getMenuItemfromId(branchid: string, menu: MenuItemData[]) {

        var first = branchid.substr(0, 2);
        var rest = branchid.substr(2, branchid.length);

        var find = menu.filter((x) => { return x.isVisible === true })[first.substr(0, 1)].childMenuItems;

        if (find.length == 0) {
            return menu;
        }

        if (rest == "") {
            return find
        }
        return this.getMenuItemfromId(rest, find);

    }

    get levelselectedBranchId() {
        return this.props.selectedBranchId.length / 2;
    }

    get selectedBranchIdHasChild() {
        return this.props.selectedBranchId.substr(this.props.selectedBranchId.length - 1, 1) === "*";
    }
}


export interface SubItemsProps extends MenuItemData {
    onMenuClick: (uri: string) => boolean | void;
    open: boolean;
    onBranchClick: (branchId: string) => void;
    branchId: string;
    selectedBranchId: string;
    top: boolean;
    sibling: MenuItemData[];
}

export interface SubItemsState {
    active: boolean;
}

export class SubItems extends React.Component<SubItemsProps, SubItemsState>{

    constructor(p, c) {
        super(p, c);
        this.state = { active: false };
    }

    startsWith(str: string, search: string) {
        return str.substr(0, search.length) === search;

    }
    render() {
        var branch = style({
            marginLeft: 15,
            paddingLeft: 15 * this.level,
            marginTop: 13,
            marginBottom: 13,
            color: "#FFF",
            display: this.props.isVisible === false ? "none" : "inherit",
            position: "relative",
            $nest: {
            }
        })

        var branchName = style({
            paddingLeft: 10
        })

        var branchItem = style({
            minHeight: 30,
            fontSize: 14,
            $nest: {
                ["& > a"]: {
                    color: this.isMenuSelected ? "#f39100" : this.props.top ? "#FFF" : "#FFF"
                },
            }
        })

        var branchIcon = style({
            position: "absolute",
            top: 7,
            right: 0,
            fontSize: 25,
            fontWeight: 900,
            cursor: "pointer"
        });



        var meunuIcon = style({
            height: 40,
            width: 40,
            fontSize: 25,
            display: this.props.icon === "" || this.props.icon == null ? "none" : "initial",

        });

        var styleHeader = style({
            padding: "0 60px",
            backgroundColor: "#ffffff",
            border: "1px solid #eaeae9",
        });
        var styleOnglet = style({
            paddingTop: 5,
            paddingBottom: 5,
            display: "inline-block",
            cursor: "pointer",
            width: 100 / this.props.sibling.length + "%",
            minWidth: "120px",
            textAlign: "center",
            $nest: {
                ["&  a"]: {
                    color: this.isMenuSelected ? "#f39100" : this.props.top ? "#FFF" : "#FFF",
                    fontSize: 14
                },
            }


        });
        var styleActif = style({
            borderBottom: "4px solid #f39100",
        });
        var styleContenu = style({
            margin: "40px 0px",
        });


        return <div className={branch} data-branch={this.props.branchId} >
            <div className={branchItem} onClick={this.onClick}>
                <span className={meunuIcon}>
                    <i className={this.props.icon} onClick={this.onClick} />
                </span>
                <a className={branchName} onClick={this.onClickA} href={this.props.uri}>
                    {this.props.title}
                </a>
            </div>

            {this.anyChild && (this.state.active || this.isMenuSelected) ?
                <SubMenu
                    top={this.props.top}
                    onBranchClick={this.props.onBranchClick}
                    branchId={this.props.branchId}
                    selectedBranchId={this.props.selectedBranchId}
                    open={this.props.open}
                    onMenuClick={this.props.onMenuClick}
                    childMenuItems={this.props.childMenuItems} /> : null}

        </div>
    }

    get level() {
        return this.props.branchId.length / 2;
    }

    LightenDarkenColor = (col: string, amt: number) => {

        var usePound = false;

        if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
        }

        var num = parseInt(col, 16);

        var r = (num >> 16) + amt;

        if (r > 255) r = 255;
        else if (r < 0) r = 0;

        var b = ((num >> 8) & 0x00FF) + amt;

        if (b > 255) b = 255;
        else if (b < 0) b = 0;

        var g = (num & 0x0000FF) + amt;

        if (g > 255) g = 255;
        else if (g < 0) g = 0;

        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);

    }

    get anyChild() {

        var child = this.props.childMenuItems == null ? [] : this.props.childMenuItems.filter(x => x.isVisible == true && x.title != null && x.title.length != 0);
        return child.length != 0;

    }

    get isMenuSelected() {
        if (this.props.top === false) {
            return this.props.selectedBranchId.substr(0, this.props.branchId.length) === this.props.branchId;
        }

        return this.props.selectedBranchId === this.props.branchId;
    }



    onClick = (e) => {
        if (this.props.selectedBranchId.substr(0, this.props.branchId.length) === this.props.branchId) {
            this.SendBranchClick();
        } else {
            this.SendBranchClick();
        }

        this.setState({ active: false });
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    onClickA = (e) => {

        this.SendBranchClick();
        var value = this.props.onMenuClick(this.props.uri);
        e.preventDefault();
    }

    private SendBranchClick = () => {
        this.props.onBranchClick(this.props.branchId);
    }

    private SendBranchParentClick = () => {
        var idParent = this.props.branchId.substr(0, this.props.branchId.length - 2);//this.props.branchId.substr(0, this.props.branchId.lastIndexOf("-"));
        this.props.onBranchClick(idParent);
    }
}


export interface TopMenuProps {
    Recherche: JSX.Element;
    Antennes: JSX.Element;
    Utilisateur: string;
    onDeconnexionClick: () => void;
}

export interface TopMenuState {
}

export class TopMenu extends React.Component<TopMenuProps, TopMenuState> {
    constructor(p, c) {
        super(p, c);
        this.state = {
        };
    }

    onUserClick = () => {
    }

    render() {
        var styleG = style({
            position: "relative",
            left: widthLeftMenu,
            right: 0,
            top: 0,
            width: getWidthDroite(),
            height: heightTopBar,
            padding: "16px 32px 16px 60px",
            backgroundColor: "#3f3b37",
            textAlign: "right",
        });
        var styleRecherche = style({
            width: "25%",
            height: "40px",
            float: "left",
        });
        var styleDroite = getFontClassName({ fontSize: "14px", color: "#ffffff", }) + " " + style({
            marginTop: "8px",
            display: "inline-block",
        });
        var styleInfosTexte = style({
            marginRight: "48px",
            $nest: {
                "& > i": {
                    fontStyle: "normal",
                    margin: "0 8px",
                },
            },
        });

        return <div className={styleG} >
            <div className={styleRecherche} >
                {this.props.Recherche}
            </div>

            <span className={styleDroite} >
                {this.props.Antennes}

                { stringIsNullOrEmpty(this.props.Utilisateur) ? null : 
                    <IconUtilisateur IconSize="14px" lineHeight={1.14} AvecCercle={false} BackgroundColor="#3f3b37" >
                        <span className={styleInfosTexte} >
                            <i>{this.props.Utilisateur}</i>
                            <IconChevron Direction={DirectionEnum.Bas} Color="#ffffff" BackgroundColor="#3f3b37" IconSize="14px" onClick={this.onUserClick} />
                        </span>
                    </IconUtilisateur>
                }

                <IconDeconnexion onClick={this.props.onDeconnexionClick} />
            </span>
        </div>
    }
}


export interface TopMenuItemProps {
    title: string;
    action: string | (() => void);
    icon: string;
}

export interface TopMenuItemState {
}

export class TopMenuItem extends React.Component<TopMenuItemProps, TopMenuItemState> {
    constructor(p, c) {
        super(p, c);
    }

    render() {
        if (typeof (this.props.action) === "string") {
            return <li title={this.props.title} data-toggle="tooltip" data-placement="bottom" >
                <a href={this.props.action} >
                    <i className={this.props.icon} ></i>
                </a>
            </li>
        } else {
            return <li title={this.props.title} data-toggle="tooltip" data-placement="bottom" >
                <a onClick={this.props.action} >
                    <i className={this.props.icon} ></i>
                </a>
            </li>
        }
    }
}


export interface MenuItemData {
    icon?: string;
    title: string;
    uri: string;
    isSelected: boolean;
    isVisible: boolean;
    childMenuItems?: MenuItemData[];
}

export interface LeftMenuProps {
    onBranchClick: (branchId: string) => void;
    menuItems: MenuItemData[];
    onHomeClick?: () => void;
    onMenuClick?: (uri: string) => boolean | void;
    selectedBranchId?: string;
}

export interface LeftMenuState {
}

export class LeftMenu extends React.Component<LeftMenuProps, LeftMenuState> {
    constructor(p, c) {
        super(p, c);
        this.state = {
            selectedBranchId: "",
        };
    }

    render() {
        var styleAside = style({
            position: "fixed",
            left: 0,
            width: widthLeftMenu,
            top: 0,
            height: "100%",
            backgroundColor: "#4e5b59",
            alignItems: "center",
            $nest: {
                '& i': {
                    cursor: "pointer",
                },
                '& a': {
                    textDecoration: "none",
                },
            },
        });
        var img_style = style({
            width: "75%",
            height: heightTopBar,
        });
        var div_style = style({
            marginTop: "15%",
        });

        var menu = <SubMenu
            open={false}
            onBranchClick={this.props.onBranchClick}
            branchId={""}
            selectedBranchId={this.props.selectedBranchId}
            onMenuClick={this.props.onMenuClick}
            childMenuItems={this.props.menuItems}
            top={false}
        />

        return <aside className={styleAside} >
            <a onClick={this.props.onHomeClick} >
                <img className={img_style} src={UP} ></img>
            </a>
            <div className={div_style} >
            </div>
            <br />
            <div className="" >
                {menu}
            </div>
        </aside>
    }
}