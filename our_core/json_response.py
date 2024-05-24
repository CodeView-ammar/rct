

import json

from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
from django.utils.encoding import force_str  # Django 1.5 / python3
from django.utils.functional import Promise
from django.utils.cache import add_never_cache_headers
import logging

logger = logging.getLogger(__name__)


class LazyEncoder(DjangoJSONEncoder):
    """Encodes django's lazy i18n strings
    """

    def default(self, obj):
        if isinstance(obj, Promise):
            return force_str(obj)
        return super(LazyEncoder, self).default(obj)


def render_to_response(context):
    """ Returns a JSON response containing 'context' as payload
    """
    return get_json_response(context)


def get_json_response(content, **httpresponse_kwargs):
    """ Construct an `HttpResponse` object.
    """
    response = HttpResponse(content,
                            content_type='application/json',
                            **httpresponse_kwargs)
    add_never_cache_headers(response)
    return response


def json_response(data):
    assert isinstance(data, dict)
    response = dict(data)
    if 'error' not in response and 'sError' not in response:
        response['result'] = 'ok'
    else:
        response['result'] = 'error'

    dump = json.dumps(response, cls=LazyEncoder)
    return render_to_response(dump)