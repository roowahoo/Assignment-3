const forms = require('forms')
const fields = forms.fields
const validators = forms.validators
const widget = widgets = require('forms').widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createProductForm = (categories, skintype, brands, tags) => {
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'directions': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'ingredients': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),

        'net_weight': fields.string({
            label:'Net Weight(g)',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer()]
        }),
        'price': fields.string({
            label:'Price(¢)',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer()]
        }),
        'stock': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer()]
        }),
        'date_of_manufacture': fields.date({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widget.date()
        }),

        'category_id': fields.string({
            label: 'Category',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: categories
        }),
        'skintype_id': fields.string({
            label: 'Skin Type',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: skintype
        }),

        'brand_id': fields.string({
            label: 'Brand',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: brands
        }),
        'tags': fields.string({
            label: 'Tags',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: forms.widgets.multipleSelect(),
            choices: tags
        }),
        'image_url': fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.hidden()

        })


    })
};

const createRegistrationForm = () => {
    return forms.create({
        'username': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'confirm_password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.matchField('password')]
        })
    })
}

const createLoginForm = () => {
    return forms.create({
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        })
    })
}

const createSearchForm=(categories, skintype, brands, tags)=>{
    return forms.create({
        'name': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'min_price': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer()]
        }),
        'max_price': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer()]
        }),
        
        'stock': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer()]
        }),
        'date_of_manufacture': fields.date({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widget.date()
        }),

        'category_id': fields.string({
            label: 'Category',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: categories
        }),
        'skintype_id': fields.string({
            label: 'Skin Type',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: skintype
        }),

        'brand_id': fields.string({
            label: 'Brand',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: brands
        }),
        'tags': fields.string({
            label: 'Tags',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: forms.widgets.multipleSelect(),
            choices: tags
        })


    })
}

const createOrderSearchForm=()=>{
    return forms.create({
        'product_name': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'amount': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'status': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget:widgets.select(),
            choices:{
                null:'',
                unpaid:'Unpaid',
                paid:'Paid'
            }
        }),
    })
}

const editOrderForm=()=>{
    return forms.create({
        'customer_name': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'shipping_address': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'email': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        
        'contact': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'status': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget:widgets.select(),
            choices:{
                null:'',
                Unpaid:'Unpaid',
                Paid:'Paid',

            }
        }),
    })

}



module.exports = { createProductForm, bootstrapField, createRegistrationForm, createLoginForm, createSearchForm, createOrderSearchForm,editOrderForm};