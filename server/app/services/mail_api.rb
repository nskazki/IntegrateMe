class MailApi
  WRONG_API_KEY = 'You must set an api_key prior to making a call'

  def initialize(api_key, debug: false)
    @api_key = api_key
    @gibbon = Gibbon::Request.new(api_key: api_key, debug: debug)
  end

  def get_lists
    result = @gibbon.lists.retrieve(params: {fields: 'lists.id,lists.name' })
    result['lists']
  rescue => e
    if e.to_s == WRONG_API_KEY
      raise "Wrong API Key:  #{@api_key}"
    elsif err_has_detail_and_title? e
      raise "#{e.title}: #{e.detail}"
    else
      raise "MailChimp responce: #{e}"
    end
  end

  def check_list(list_id)
    @gibbon.lists(list_id).retrieve
    return nil
  rescue => e
    if e.to_s == WRONG_API_KEY
      return "Wrong API Key: #{@api_key}!"
    elsif defined? e.status_code && e.status_code == 401
      return "Wrong API Key: #{@api_key}!"
    elsif err_has_detail_and_title? e
      raise "#{e.title}: #{e.detail}"
    else
      raise "MailChimp responce: #{e}"
    end
  end

  def add_member_to_list(list_id, email, name)
    @gibbon.lists(list_id).members.create(
      body: {
        email_address: email,
        status: 'subscribed',
        merge_fields: { FNAME: name || '' }
      }
    )
  rescue => e
    if err_has_detail_and_title? e
      raise "#{e.title}: #{e.detail}"
    else
      raise "MailChimp responce: #{e}"
    end
  end

  private
  def err_has_detail_and_title?(e)
    if !(defined? e.title) || !(defined? e.detail) then return false end
    if !(e.title.is_a? String) || !(e.detail.is_a? String) then return false end
    return !e.title.empty? && !e.detail.empty?
  end
end
