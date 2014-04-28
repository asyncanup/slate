define(function (require) {
    
    var notify = humane.create({ baseCls: 'humane-jackedup' });
    
    return {
        log: notify.log.bind(notify),
        success: notify.spawn({ addnCls: "humane-jackedup-success" }),
        error: notify.spawn({ addnCls: "humane-jackedup-error" })
    };
});
